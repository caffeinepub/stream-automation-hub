import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    isOwner : Bool;
    stripeCustomerId : ?Text;
    subscriptionStatus : { #inactive; #active; #cancelled };
    subscriptionTier : ?{ #monthly; #annual };
    subscriptionStartDate : ?Nat;
    subscriptionEndDate : ?Nat;
  };

  type NewUserProfile = {
    name : Text;
    isOwner : Bool;
    twitchUsername : ?Text;
    stripeCustomerId : ?Text;
    subscriptionStatus : { #inactive; #active; #cancelled };
    subscriptionTier : ?{ #monthly; #annual };
    subscriptionStartDate : ?Nat;
    subscriptionEndDate : ?Nat;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = Map.empty<Principal, NewUserProfile>();
    for ((principal, oldProfile) in old.userProfiles.entries()) {
      let newProfile : NewUserProfile = {
        name = oldProfile.name;
        isOwner = oldProfile.isOwner;
        twitchUsername = null;
        stripeCustomerId = oldProfile.stripeCustomerId;
        subscriptionStatus = oldProfile.subscriptionStatus;
        subscriptionTier = oldProfile.subscriptionTier;
        subscriptionStartDate = oldProfile.subscriptionStartDate;
        subscriptionEndDate = oldProfile.subscriptionEndDate;
      };
      newUserProfiles.add(principal, newProfile);
    };
    { userProfiles = newUserProfiles };
  };
};
