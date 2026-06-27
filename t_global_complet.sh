* [33m674305d[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mrelease/v1.0.0[m[33m, [m[1;33mtag: [m[1;33mv1.3.0[m[33m, [m[1;32mfix/audit-securite-v1.3[m[33m)[m feat: contraintes uniques idempotency_key et code+statut
* [33m7674490[m fix: TransfertService - idempotence, lock sur agences, verification solde annulation
* [33m6587347[m fix: LedgerService - ajout getSoldeWithLock, verification double ecriture
* [33mccde207[m[33m ([m[1;33mtag: [m[1;33mv1.2.0[m[33m, [m[1;32mfix/audit-corrections-v1.2[m[33m)[m feat: rate limiting sur routes financieres sensibles
* [33m2efdbc2[m feat: ajout channel audit pour logs financiers
* [33ma4956a4[m feat: TransfertRequest avec idempotency_key
* [33m32c391f[m feat: migration ajout idempotency_key dans transferts
* [33me385dd1[m fix: nettoyage TransfertModel - suppression colonnes dupliquees, ajout idempotency_key
* [33mb920efb[m fix: correction TransfertService - verification frais, solde annulation, idempotence
* [33m73fb9c6[m[33m ([m[1;33mtag: [m[1;33mv1.1.0[m[33m, [m[1;32mfeature/ameliorations-v1.1[m[33m)[m fix: migration nettoyage avec suppression des contraintes FK
* [33m94436e6[m feat: nettoyage colonnes dupliquees dans transferts
* [33m8850781[m feat: ajout verification double annulation et statut RETIRE
* [33m4a25f39[m fix: correction syntaxe Transfert.php - relation utilisateurAnnulation
* [33maac1759[m fix: ajout try/catch dans TransfertService pour debug
* [33m49e449a[m test: script complet d'annulation
* [33mb1db33d[m fix: correction routes api transferts annuler et verifier
* [33m1a4ae44[m fix: migration et relation utilisateur_annulation_id
* [33m5845ecc[m fix: ajout colonne utilisateur_annulation_id dans transferts
* [33m36b7869[m fix: ajout try/catch dans TransfertController pour debug annulation
* [33m0e4fbec[m fix: correction annulation transfert avec remboursement ledger
* [33m7598887[m test: ajout script de test complet pour validation
* [33mfed3be1[m[33m ([m[1;33mtag: [m[1;33mv1.0.0[m[33m, [m[1;32mfeature/retrait-annulation[m[33m)[m feat: ajout scopes parCode et parStatut dans Transfert
* [33m29b0b33[m feat: ajout methodes retirer et annuler dans TransfertController
* [33me07d9ef[m feat: ajout retrait et annulation dans TransfertService
* [33m22de02a[m fix: securisation routes ledger avec auth:sanctum
* [33m9b79d75[m[33m ([m[1;32mfix/phase1-critical-models-ledger[m[33m)[m fix: Handler API pour unauthenticated en JSON
* [33m7c3db69[m fix: nettoyage LedgerService - suppression code bash
* [33mdec9197[m feat: ajout methode getByAgence dans LedgerService
* [33m6ed27bb[m fix: LedgerController safe avec logs et gestion d'erreurs
* [33med4943e[m fix: correction LedgerController avec try-catch
* [33m34d83ab[m feat: securisation ledger avec lockForUpdate + endpoint audit
* [33m4cca555[m feat: ajout endpoint ledger pour audit et tracabilite
* [33m9c23172[m feat: ajout endpoint ledger pour audit et tracabilite
* [33m9fc4857[m chore: nettoyage des fichiers temporaires
* [33m08d920c[m feat: systeme de transfert complet avec ledger automatique et transaction DB
* [33mfc6b348[m fix: TransfertService avec DB::transaction et ledger automatique
* [33m662f42f[m chore: nettoyage des fichiers de sauvegarde
* [33m86cee05[m feat: API Makonon Transfert 100% operationnelle
* [33m4c95548[m fix: correction TransfertController - ajout de toutes les methodes manquantes
* [33m95ca072[m feat: ajout constantes LedgerNature
* [33ma978306[m feat: API transfert completement operationnelle - Authentification Sanctum OK - Creation transfert avec code unique - Ledger avec double ecriture (debit/credit) - Gestion des agences et clients - Securisation avec DB::transaction
* [33m70b17fc[m fix: correction finale code transfert - fillable + generateur
* [33m6cbecd7[m fix: TransfertService utilise Transfert::generateCode()
* [33mac88af6[m fix: ajout code dans  de Transfert
* [33m5944c00[m fix: TransfertController utilise TransfertService
* [33m4112266[m fix: creation TransfertService avec generation code
* [33m55dd33b[m fix: ajout generation code unique dans TransfertController
* [33m348b2bb[m fix: ajout colonnes reference et description dans ledger
* [33md90db6d[m fix: securisation LedgerService avec DB::transaction, lockForUpdate et validation montant
* [33mf766bf0[m fix: AuthController compatible avec Request et LoginRequest
* [33m5d1c124[m feat: migration ajout colonne telephone et actif dans utilisateurs
* [33m7eebbd9[m fix: Agence utilise la relation avec User
* [33mabf7414[m fix: AuthController utilise password_hash et nom
* [33m6eff77a[m fix: User model utilise la table utilisateurs existante
* [33m609a930[m feat: migration correction des colonnes transferts pour compatibilité
* [33m8f0d2db[m fix: correction Transfert.php avec toutes les colonnes et relations
* [33m04959c6[m fix: correction Agence.php pour utiliser User au lieu de Utilisateur
* [33m7c0cd3f[m fix: correction AuthController pour utiliser User au lieu de Utilisateur
* [33me175d18[m fix: suppression du modele Utilisateur doublon
* [33m1fbb4f2[m feat: migration ajout colonnes manquantes users et ledger + indexes performance
* [33m7794d14[m fix: securisation LedgerService avec DB::transaction, lockForUpdate, validation montant et FondsInsuffisantsException
* [33m5788984[m fix: correction du modele Ledger avec timestamps, relations et scopes
* [33mbf50e9e[m fix: correction complete du modele User avec relations et methodes utilitaires
* [33mf9efae0[m[33m ([m[1;32mmaster[m[33m)[m Initial commit: Makonon Transfert API
