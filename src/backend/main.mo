import Set "mo:core/Set";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile System
  public type UserProfile = {
    name : Text;
    isOwner : Bool;
    stripeCustomerId : ?Text;
    subscriptionStatus : SubscriptionStatus;
    subscriptionTier : ?SubscriptionTier;
    subscriptionStartDate : ?Nat;
    subscriptionEndDate : ?Nat;
  };

  public type SubscriptionTier = { #monthly; #annual };
  public type SubscriptionStatus = { #inactive; #active; #cancelled };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Define the owner username
  let OWNER_USERNAME : Text = "CelestiNix";

  // Helper function to check if a principal should be the owner
  func shouldBeOwner(caller : Principal) : Bool {
    // Check if the caller's principal corresponds to CelestiNix
    // This checks against the textual representation of the principal
    let principalText = caller.toText();

    // Also check if there's a profile with the owner username
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.name == OWNER_USERNAME;
      };
      case (null) { false };
    };
  };

  // Helper function to ensure owner badge is assigned correctly
  func ensureOwnerBadge(caller : Principal, profile : UserProfile) : UserProfile {
    let shouldHaveOwnerBadge = profile.name == OWNER_USERNAME;

    if (shouldHaveOwnerBadge and not profile.isOwner) {
      // Automatically assign owner badge to CelestiNix
      { profile with isOwner = true };
    } else if (not shouldHaveOwnerBadge and profile.isOwner) {
      // Remove owner badge from non-CelestiNix users
      { profile with isOwner = false };
    } else {
      profile;
    };
  };

  public query ({ caller }) func isUserOwner() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check owner status");
    };
    isOwner(caller);
  };

  func isOwner(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        // Owner status is only valid if username is CelestiNix
        profile.isOwner and profile.name == OWNER_USERNAME;
      };
      case (null) { false };
    };
  };

  func requireOwner(caller : Principal) : () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only the app owner can perform this action");
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };

    // Automatically create profile with owner badge if this is CelestiNix's first access
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Enforce owner badge rules: only CelestiNix can have isOwner = true
    let safeProfile = ensureOwnerBadge(caller, profile);

    userProfiles.add(caller, safeProfile);
  };

  public shared ({ caller }) func setUserOwnerStatus(user : Principal, isOwnerStatus : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set owner status");
    };

    switch (userProfiles.get(user)) {
      case (?profile) {
        // Only allow setting owner status to true if username is CelestiNix
        if (isOwnerStatus and profile.name != OWNER_USERNAME) {
          Runtime.trap("Unauthorized: Only user 'CelestiNix' can have owner status");
        };

        // Only allow removing owner status from non-CelestiNix users
        if (not isOwnerStatus and profile.name == OWNER_USERNAME) {
          Runtime.trap("Unauthorized: Cannot remove owner status from 'CelestiNix'");
        };

        let updatedProfile = {
          profile with isOwner = isOwnerStatus;
        };
        userProfiles.add(user, updatedProfile);
      };
      case (null) {
        Runtime.trap("User profile not found");
      };
    };
  };

  public query ({ caller }) func checkSubscriptionStatus() : async SubscriptionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check subscription status");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { profile.subscriptionStatus };
      case (null) { #inactive };
    };
  };

  // Subscription Plan Management (Owner-only)
  public type SubscriptionPlan = {
    id : Nat;
    name : Text;
    description : Text;
    tier : SubscriptionTier;
    priceInCents : Nat;
    features : [Text];
    isActive : Bool;
  };

  module SubscriptionPlan {
    public func compare(a : SubscriptionPlan, b : SubscriptionPlan) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let subscriptionPlans = Map.empty<Nat, SubscriptionPlan>();
  var nextPlanId = 0;

  public shared ({ caller }) func createSubscriptionPlan(
    name : Text,
    description : Text,
    tier : SubscriptionTier,
    priceInCents : Nat,
    features : [Text]
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create subscription plans");
    };
    requireOwner(caller);

    let plan : SubscriptionPlan = {
      id = nextPlanId;
      name;
      description;
      tier;
      priceInCents;
      features;
      isActive = true;
    };

    subscriptionPlans.add(nextPlanId, plan);
    nextPlanId += 1;
    plan.id;
  };

  // Public query - no auth needed for viewing pricing
  public query ({ caller }) func getSubscriptionPlan(planId : Nat) : async ?SubscriptionPlan {
    subscriptionPlans.get(planId);
  };

  public query ({ caller }) func getAllSubscriptionPlans() : async [SubscriptionPlan] {
    subscriptionPlans.values().toArray().sort();
  };

  public query ({ caller }) func getActiveSubscriptionPlans() : async [SubscriptionPlan] {
    let activePlans = subscriptionPlans.values().filter(
      func(plan : SubscriptionPlan) : Bool {
        plan.isActive;
      }
    );
    activePlans.toArray().sort();
  };

  public shared ({ caller }) func updateSubscriptionPlan(
    planId : Nat,
    name : Text,
    description : Text,
    priceInCents : Nat,
    features : [Text],
    isActive : Bool
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update subscription plans");
    };
    requireOwner(caller);

    switch (subscriptionPlans.get(planId)) {
      case (?plan) {
        let updatedPlan = {
          plan with
          name = name;
          description = description;
          priceInCents = priceInCents;
          features = features;
          isActive = isActive;
        };
        subscriptionPlans.add(planId, updatedPlan);
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };
  };

  public shared ({ caller }) func deleteSubscriptionPlan(planId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete subscription plans");
    };
    requireOwner(caller);

    switch (subscriptionPlans.get(planId)) {
      case (?_plan) {
        subscriptionPlans.remove(planId);
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };
  };

  public shared ({ caller }) func toggleSubscriptionPlanStatus(planId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle subscription plan status");
    };
    requireOwner(caller);

    switch (subscriptionPlans.get(planId)) {
      case (?plan) {
        let updatedPlan = {
          plan with isActive = not plan.isActive;
        };
        subscriptionPlans.add(planId, updatedPlan);
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };
  };

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe integration");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func createStripeSubscription(planId : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe");
    };

    let plan = switch (subscriptionPlans.get(planId)) {
      case (?p) {
        if (not p.isActive) {
          Runtime.trap("Subscription plan is not active");
        };
        p;
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };

    let items : [Stripe.ShoppingItem] = [{
      currency = "usd";
      productName = plan.name;
      productDescription = plan.description;
      priceInCents = plan.priceInCents;
      quantity = 1;
    }];

    let successUrl = "https://your-frontend-success-url.com";
    let cancelUrl = "https://your-frontend-cancel-url.com";
    await createCheckoutSession(items, successUrl, cancelUrl);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func hasActiveSubscription(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.subscriptionStatus == #active;
      };
      case (null) { false };
    };
  };

  func requireActiveSubscription(caller : Principal) : () {
    if (not hasActiveSubscription(caller)) {
      Runtime.trap("Active subscription required");
    };
  };

  public type TwitchAccountStatus = { #pending; #approved; #suspended };
  public type TwitchAccount = {
    id : Nat;
    owner : Principal;
    username : Text;
    accountType : { #affiliate; #partner };
    status : TwitchAccountStatus;
  };

  module TwitchAccount {
    public func compare(a : TwitchAccount, b : TwitchAccount) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareReverse(a : TwitchAccount, b : TwitchAccount) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let twitchAccounts = Map.empty<Nat, TwitchAccount>();
  let activeTwitchAccountIds = Set.empty<Nat>();
  var nextTwitchAccountId = 0;

  public shared ({ caller }) func createTwitchAccount(username : Text, accountType : { #affiliate; #partner }) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create Twitch accounts");
    };
    requireActiveSubscription(caller);

    let account : TwitchAccount = {
      id = nextTwitchAccountId;
      owner = caller;
      username;
      accountType;
      status = #pending;
    };

    twitchAccounts.add(nextTwitchAccountId, account);
    activeTwitchAccountIds.add(nextTwitchAccountId);
    nextTwitchAccountId += 1;
    account.id;
  };

  public shared ({ caller }) func upgradeTwitchAccount(accountId : Nat, accountType : { #affiliate; #partner }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade Twitch accounts");
    };

    let account = switch (twitchAccounts.get(accountId)) {
      case (?acc) {
        if (acc.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only upgrade your own accounts");
        };
        acc;
      };
      case (null) {
        Runtime.trap("Twitch account not found");
      };
    };

    // Require active subscription for non-admin users
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      requireActiveSubscription(caller);
    };

    let upgradedAccount = {
      account with accountType = accountType;
    };

    twitchAccounts.add(accountId, upgradedAccount);
  };

  public query ({ caller }) func getTwitchAccount(accountId : Nat) : async ?TwitchAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Twitch accounts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins bypass subscription check
    if (not isAdmin) {
      requireActiveSubscription(caller);
    };

    switch (twitchAccounts.get(accountId)) {
      case (?account) {
        if (account.owner != caller and not isAdmin) {
          Runtime.trap("Unauthorized: Can only view your own accounts");
        };
        ?account;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllTwitchAccounts() : async [TwitchAccount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Twitch accounts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins bypass subscription check
    if (not isAdmin) {
      requireActiveSubscription(caller);
    };

    let accounts = activeTwitchAccountIds.values().flatMap(
      func(accountId) {
        switch (twitchAccounts.get(accountId)) {
          case (?account) {
            if (isAdmin or account.owner == caller) {
              Iter.singleton(account);
            } else {
              Iter.empty<TwitchAccount>();
            };
          };
          case (null) { Iter.empty<TwitchAccount>() };
        };
      }
    );
    accounts.toArray().sort();
  };

  public shared ({ caller }) func updateTwitchAccountStatus(accountId : Nat, status : TwitchAccountStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update Twitch accounts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins bypass subscription check
    if (not isAdmin) {
      requireActiveSubscription(caller);
    };

    switch (twitchAccounts.get(accountId)) {
      case (?account) {
        if (account.owner != caller and not isAdmin) {
          Runtime.trap("Unauthorized: Can only update your own accounts");
        };

        let updatedAccount = {
          account with status = status;
        };

        twitchAccounts.add(accountId, updatedAccount);
      };
      case (null) {
        Runtime.trap("Account not found");
      };
    };
  };

  public type RevenueEntry = {
    id : Nat;
    accountId : Nat;
    timestamp : Nat;
    amount : Float;
    description : Text;
  };

  module RevenueEntry {
    public func compare(a : RevenueEntry, b : RevenueEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareReverse(a : RevenueEntry, b : RevenueEntry) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let revenues = Map.empty<Nat, RevenueEntry>();
  var nextRevenueId = 0;

  public shared ({ caller }) func addRevenueEntry(accountId : Nat, amount : Float, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add revenues");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins bypass subscription check
    if (not isAdmin) {
      requireActiveSubscription(caller);
    };

    switch (twitchAccounts.get(accountId)) {
      case (?account) {
        if (account.owner != caller and not isAdmin) {
          Runtime.trap("Unauthorized: Can only add revenues to your own accounts");
        };
      };
      case (null) {
        Runtime.trap("Associated account not found");
      };
    };

    let entry : RevenueEntry = {
      id = nextRevenueId;
      accountId;
      timestamp = getCurrentTime();
      amount;
      description;
    };

    revenues.add(nextRevenueId, entry);
    nextRevenueId += 1;
    entry.id;
  };

  public query ({ caller }) func getRevenueEntry(revenueId : Nat) : async ?RevenueEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view revenue entries");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins bypass subscription check
    if (not isAdmin) {
      requireActiveSubscription(caller);
    };

    switch (revenues.get(revenueId)) {
      case (?entry) {
        switch (twitchAccounts.get(entry.accountId)) {
          case (?account) {
            if (account.owner != caller and not isAdmin) {
              Runtime.trap("Unauthorized: Can only view revenues for your own accounts");
            };
            ?entry;
          };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllRevenueEntries() : async [RevenueEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view revenue entries");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins bypass subscription check
    if (not isAdmin) {
      requireActiveSubscription(caller);
    };

    let filteredRevenues = revenues.values().filter(
      func(entry : RevenueEntry) : Bool {
        if (isAdmin) {
          true;
        } else {
          switch (twitchAccounts.get(entry.accountId)) {
            case (?account) { account.owner == caller };
            case (null) { false };
          };
        };
      }
    );

    filteredRevenues.toArray().sort();
  };

  func getCurrentTime() : Nat {
    0;
  };
};
