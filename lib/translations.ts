export const translations = {
  gr: {
    common: {
      loading: "Φόρτωση...",
      success: "Επιτυχία",
      error: "Σφάλμα",
    },
    nav: {
      home: "Αρχική",
      history: "Ιστορικό",
      create: "Δημιουργία",
      profile: "Προφίλ",
      logout: "Αποσύνδεση"
    },
    matches: {
      title: "Διαθέσιμοι Αγώνες",
      subtitle: "Βρείτε και συμμετέχετε σε παιχνίδια κοντά σας",
      join: "Συμμετοχή",
      players: "Παίκτες",
      location: "Τοποθεσία",
      date: "Ημερομηνία",
      time: "Ώρα",
      host: "Διοργανωτής",
      private: "Ιδιωτικό",
      full: "Πλήρες",
      status: {
        upcoming: "Επερχόμενος",
        in_progress: "Σε Εξέλιξη",
        finished: "Ολοκληρώθηκε",
        cancelled: "Ακυρώθηκε"
      },
      details: {
        location: "Τοποθεσία",
        openInMaps: "Άνοιγμα στους Χάρτες",
        costPerPlayer: "Κόστος ανά Παίκτη",
        joinMatch: "Συμμετοχή στον Αγώνα",
        joinPrivate: "Συμμετοχή σε Ιδιωτικό Αγώνα",
        enterCode: "Εισάγετε 6-ψήφιο κωδικό",
        submitCode: "Υποβολή Κωδικού",
        cancelParticipation: "Ακύρωση Συμμετοχής",
        cannotCancel: "Δεν μπορείτε να ακυρώσετε (< 8ω πριν τον αγώνα)",
        deleteMatch: "Διαγραφή Αγώνα",
        deleteWarning: "Μπορείτε να διαγράψετε αυτόν τον αγώνα επειδή είναι λιγότερο από 90% γεμάτος",
        markAsFinished: "Ολοκλήρωση Αγώνα",
        privateCode: "Κωδικός Ιδιωτικού Αγώνα",
        copyCode: "Αντιγραφή",
        share: "Κοινοποίηση",
        codeCopied: "Ο κωδικός αντιγράφηκε",
        shareNotSupported: "Η κοινοποίηση δεν υποστηρίζεται",
        shareTitle: "Έλα στον αγώνα μου!",
        shareText: "Έλα στον αγώνα μου στο {venue}! Κωδικός: {code}"
      }
    },
    footer: {
      joinCommunity: "Γίνετε μέλος της κοινότητας και ξεκινήστε να παίζετε σήμερα"
    },
    profile: {
      title: "Προφίλ",
      fullName: "Ονοματεπώνυμο",
      notSet: "Δεν έχει οριστεί",
      username: "Όνομα χρήστη",
      phoneNumber: {
        label: "Αριθμός Τηλεφώνου",
        placeholder: "Εισάγετε αριθμό τηλεφώνου"
      },
      sharePhone: "Κοινοποίηση Τηλεφώνου",
      sharePhoneDesc: "Επιτρέψτε στους διοργανωτές να βλέπουν το τηλέφωνό σας",
      emailNotifications: "Ειδοποιήσεις Email",
      emailNotificationsDesc: "Θέλετε να λαμβάνετε ειδοποιήσεις όταν δημιουργούνται νέοι αγώνες;",
      playerRatings: "Αξιολογήσεις Παίκτη",
      speed: "Ταχύτητα",
      pace: "Ρυθμός",
      power: "Δύναμη",
      selfRating: "Προσωπική Αξιολόγηση",
      communityRating: "Αξιολόγηση Κοινότητας",
      basedOnFeedback: "Βάσει σχολίων κοινότητας",
      noRatingsYet: "Δεν υπάρχουν ακόμη αξιολογήσεις",
      updateProfile: "Ενημέρωση Προφίλ",
      changePhoto: "Αλλαγή Φωτογραφίας",
      uploadSuccess: "Η φωτογραφία προφίλ ενημερώθηκε",
      uploadError: "Αποτυχία μεταφόρτωσης φωτογράφιας",
      updateSuccess: "Το προφίλ ενημερώθηκε με επιτυχία",
      updateError: "Αποτυχία ενημέρωσης προφίλ",
      usernameTaken: "Το όνομα χρήστη χρησιμοποιείται ήδη",
      ratings: {
        speed: {
          label: "Ταχύτητα",
          value: "Ταχύτητα: {value}"
        },
        pace: {
          label: "Αντοχή",
          value: "Αντοχή: {value}"
        },
        power: {
          label: "Δύναμη",
          value: "Δύναμη: {value}"
        }
      }
    },
    history: {
      title: "Ιστορικό Αγώνων",
      subtitle: "Δείτε τους προηγούμενους αγώνες σας",
      noMatches: "Δεν υπάρχουν αγώνες στο ιστορικό",
      tabs: {
        upcoming: "Επερχόμενοι",
        finished: "Ολοκληρωμένοι"
      },
      rateMatch: "Αξιολόγηση Αγώνα",
      ratePlayer: "Αξιολόγηση Παίκτη",
      hideRatings: "Απόκρυψη Αξιολογήσεων",
      showRatings: "Εμφάνιση Αξιολογήσεων",
      ratings: {
        title: "Αξιολογήσεις",
        submitRating: "Υποβολή",
        submitting: "Υποβολή...",
        success: "Η αξιολόγηση καταχωρήθηκε",
        error: "Σφάλμα κατά την αξιολόγηση"
      }
    },
    create: {
      title: "Δημιουργία Νέου Αγώνα",
      venue: {
        label: "Γήπεδο",
        placeholder: "Επιλέξτε γήπεδο",
        bookingMessage: "Εάν δεν έχετε κάνει ακόμη κράτηση, καλέστε στο: {phone}"
      },
      date: {
        label: "Ημερομηνία",
        placeholder: "Επιλέξτε ημερομηνία"
      },
      time: {
        label: "Ώρα",
        placeholder: "Επιλέξτε ώρα"
      },
      players: {
        label: "Αριθμός Παικτών",
        suffix: "παίκτες"
      },
      cost: {
        label: "Κόστος ανά Παίκτη (€)",
        placeholder: "Εισάγετε κόστος"
      },
      privateMatch: {
        label: "Ιδιωτικός Αγώνας",
        description: "Μόνο παίκτες με κωδικό μπορούν να συμμετάσχουν"
      },
      venueConfirmation: {
        label: "Επιβεβαίωση Κράτησης",
        description: "Επιβεβαιώνω ότι έχω ήδη επικοινωνήσει και κάνει κράτηση του γηπέδου. Κατανοώ ότι η δημιουργία αγώνων χωρίς προηγούμενη κράτηση γηπέδου μπορεί να οδηγήσει σε αποκλεισμό από την πλατφόρμα."
      },
      submit: {
        creating: "Δημιουργία...",
        create: "Δημιουργία Αγώνα"
      },
      errors: {
        venueRequired: "Παρακαλώ επιλέξτε γήπεδο",
        dateRequired: "Παρακαλώ επιλέξτε ημερομηνία",
        dateInPast: "Η ημερομηνία δεν μπορεί να είναι στο παρελθόν",
        timeInvalid: "Παρακαλώ επιλέξτε έγκυρη ώρα (10:00-23:00, κάθε 30 λεπτά)",
        playersRange: "Ο αριθμός παικτών πρέπει να είναι μεταξύ 10 και 16",
        costNegative: "Το κόστος δεν μπορεί να είναι αρνητικό",
        venueConfirmRequired: "Πρέπει να επιβεβαιώσετε την κράτηση του γηπέδου"
      }
    },
    auth: {
      loginTitle: "Βρείτε και Συμμετέχετε σε Αγώνες Ποδοσφαίρου",
      loginSubtitle: "Στην Περιοχή σας",
      loginDescription: "Συνδεθείτε με παίκτες, οργανώστε παιχνίδια και μην χάσετε κανέναν αγώνα",
      connectWithGoogle: "Σύνδεση με Google",
      features: {
        findMatches: {
          title: "Βρείτε Τοπικούς Αγώνες",
          description: "Ανακαλύψτε παιχνίδια κοντά σας"
        },
        joinTeams: {
          title: "Συμμετοχή σε Ομάδες",
          description: "Συνδεθείτε με άλλους παίκτες και συμμετέχετε άμεσα"
        },
        organizeGames: {
          title: "Οργανώστε Παιχνίδια",
          description: "Δημιουργήστε και διαχειριστείτε τους αγώνες σας"
        },
        ratePlayers: {
          title: "Αξιολογήστε Παίκτες",
          description: "Χτίστε τη φήμη σας στην κοινότητα"
        }
      }
    }
  }
}; 