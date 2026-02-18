import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Actor before migration.
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // Old profile model before migration.
  type OldUserProfile = {
    name : Text;
    stripeCustomerId : ?Text;
    subscriptionStatus : { #inactive; #active; #cancelled };
    subscriptionTier : ?{ #monthly; #annual };
    subscriptionStartDate : ?Nat;
    subscriptionEndDate : ?Nat;
  };

  // New profile model with isOwner field after migration.
  type NewUserProfile = {
    name : Text;
    isOwner : Bool;
    stripeCustomerId : ?Text;
    subscriptionStatus : { #inactive; #active; #cancelled };
    subscriptionTier : ?{ #monthly; #annual };
    subscriptionStartDate : ?Nat;
    subscriptionEndDate : ?Nat;
  };

  // Actor after migration. All unchanged remaining state fields omitted for brevity.
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  /// Performs upgrade transformation from old actor to new actor with isOwner flag support.
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with isOwner = false };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
