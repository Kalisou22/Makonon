<?php

namespace AppServices;

use AppModelsTransfert;
use AppModelsClient;
use AppModelsAgence;
use AppModelsUser;
use AppExceptionsFondsInsuffisantsException;
use AppExceptionsTransfertException;
use IlluminateSupportFacadesDB;
use IlluminateSupportFacadesLog;

class TransfertService
{\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
    private const MAX_MONTANT = 999999999.99;
    protected LedgerService $ledger;

    public function __construct(LedgerService $ledger)
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $this->ledger = $ledger;
    

    public function creer(array $data, User $user): Transfert
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        if (empty($datadempotency_key'{\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}}' 
            throw new TransfertException('Clé idempotence requise', 422);
        

        return DB::transaction(function () use ($data, $user) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            $existing = Transfert::where('idempotency_key', $datadempotency_key'      if ($existing) 
                Log::info('Transfert existant retourné (idempotence)', 
dempotency_key' => $datadempotency_key' return $existing;
            

            $agenceEmettrice = Agence::where('id', $datagence_envoi_id''agence_destinataire_id'
            $system = $this->ledger->getSystemAccount();
            $fraisAccount = $this->ledger->getFraisAccount();

            if (!$agenceEmettrice  !$agenceDestinataire) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException('Agence non trouvée', 404);
            

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agenceEmettrice->id) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException('Accès interdit: vous ne pouvez pas créer de transfert depuis cette agence', 403);
            

            $expediteur = Client::firstOrCreate(
                elephone' => $dataelephone_expediteur'om' => $dataom_expediteur' elephone' => $dataelephone_beneficiaire'om' => $dataom_beneficiaire''montant''montant' ($total > self::MAX_MONTANT) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException("Montant total dépasse la limite", 422);
            

            $solde = $this->ledger->getSolde($agenceEmettrice->id);
            if ($solde < $total) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new FondsInsuffisantsException($solde, $total);
            

            $code = 'TRF' . date('Ymd') . strtoupper(substr(uniqid(), -6));
            $transfert = Transfert::create(
ode' => strtoupper($code),
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $agenceEmettrice->id,
                'agence_retrait_id' => $agenceDestinataire->id,
                'utilisateur_envoi_id' => $user->id,
                'montant' => $dataontant'atadempotency_key'$total");
            $this->ledger->credit($system, $total, 'ENVOI', $transfert->id, $user->id, $code, "Crédit SYSTEM - Total: $total");
            $this->ledger->debit($system, $dataontant'{\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}}' $dataontant'");
            $this->ledger->credit($agenceDestinataire, $dataontant'{\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}}' $dataontant'");
            $this->ledger->debit($system, $frais, 'FRAIS', $transfert->id, $user->id, $code, "Débit SYSTEM - Frais: $frais");
            $this->ledger->credit($fraisAccount, $frais, 'FRAIS', $transfert->id, $user->id, $code, "Crédit FRAIS - Frais: $frais");

            $this->ledger->mettreAJourSoldeCache($agenceEmettrice->id);
            $this->ledger->mettreAJourSoldeCache($agenceDestinataire->id);
            $this->ledger->mettreAJourSoldeCache($system->id);
            $this->ledger->mettreAJourSoldeCache($fraisAccount->id);

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert créé avec succès', 
d' => $transfert->id,
                'code' => $code,
                'statut' => 'ENVOYE',
                'agence_envoi' => $agenceEmettrice->id,
                'agence_retrait' => $agenceDestinataire->id,
                'montant' => $dataontant');
    

    //  RETRAIT : NE MODIFIE PAS LE LEDGER
    public function retirer(string $code, User $user): Transfert
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return DB::transaction(function () use ($code, $user) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            $code = strtoupper(trim($code));

            $transfert = Transfert::where('code', $code)
                ->where('statut', 'ENVOYE')
                ->lockForUpdate()
                ->first();

            if (!$transfert) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException('Transfert non disponible ou déjà traité', 404);
            

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $transfert->agence_retrait_id) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException('Accès interdit: vous ne pouvez pas retirer ce transfert', 403);
            

            //  RETRAIT = VALIDATION UNIQUEMENT (pas d'écriture ledger)
            $transfert->update(
tatut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
            sfert retiré avec succès (ledger inchangé)', 
d' => $transfert->id,
                'code' => $code,
                'agence_retrait' => $transfert->agence_retrait_id,
                'utilisateur' => $user->id
                   return $transfert;
        );
    

    //  ANNULATION : INVERSE LES ÉCRITURES DE CREATION
    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return DB::transaction(function () use ($code, $user, $motif) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            $code = strtoupper(trim($code));

            $transfert = Transfert::where('code', $code)
                ->whereIn('statut', NVOYE', 'EN_ATTENTE'if (!$transfert) 
                throw new TransfertException('Transfert introuvable ou déjà traité', 404);
            

            if ($transfert->statut === 'RETIRE') {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException('Impossible d'annuler un transfert déjà retiré', 400);
            

            $agenceEmettrice = Agence::where('id', $transfert->agence_envoi_id)->lockForUpdate()->first();

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agenceEmettrice->id) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
                throw new TransfertException('Accès interdit: vous ne pouvez pas annuler ce transfert', 403);
            

            $agenceDestinataire = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();
            $system = $this->ledger->getSystemAccount();
            $fraisAccount = $this->ledger->getFraisAccount();

            $totalARembourser = $transfert->montant + $transfert->frais;
            $transfert->update(
tatut' => 'ANNULE',
                'date_annulation' => now(),
                'utilisateur_annulation_id' => $user->id,
                'motif_annulation' => $motif ?? 'Annulation par l'utilisateur',
            dger->credit($agenceEmettrice, $totalARembourser, 'ANNULATION', $transfert->id, $user->id, $code, "Crédit AG001 - Annulation: $totalARembourser");
            $this->ledger->debit($system, $totalARembourser, 'ANNULATION', $transfert->id, $user->id, $code, "Débit SYSTEM - Annulation: $totalARembourser");
            $this->ledger->credit($system, $transfert->montant, 'ANNULATION', $transfert->id, $user->id, $code, "Crédit SYSTEM - Annulation: $transfert->montant");
            $this->ledger->debit($agenceDestinataire, $transfert->montant, 'ANNULATION', $transfert->id, $user->id, $code, "Débit AG002 - Annulation: $transfert->montant");
            $this->ledger->credit($system, $transfert->frais, 'ANNULATION', $transfert->id, $user->id, $code, "Crédit SYSTEM - Annulation frais: $transfert->frais");
            $this->ledger->debit($fraisAccount, $transfert->frais, 'ANNULATION', $transfert->id, $user->id, $code, "Débit FRAIS - Annulation: $transfert->frais");

            $this->ledger->mettreAJourSoldeCache($agenceEmettrice->id);
            $this->ledger->mettreAJourSoldeCache($agenceDestinataire->id);
            $this->ledger->mettreAJourSoldeCache($system->id);
            $this->ledger->mettreAJourSoldeCache($fraisAccount->id);

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert annulé avec succès (écritures inversées)', 
d' => $transfert->id,
                'code' => $code,
                'agence_envoi' => $agenceEmettrice->id,
                'agence_retrait' => $agenceDestinataire->id,
                'montant' => $transfert->montant,
                'frais' => $transfert->frais
               return $transfert;
        );
    

    private function calculerFrais(float $montant): float
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore},phpunit.result.cache},123456789\,,2\,,3\,,5000\,,987654321\,,A{ccès\ non\ autorisé\,,ppHttpMiddleware{Check{Agence::class\,,Role::class\,},RedirectIfAuthenticated::class\,}},Illuminate{AuthMiddleware{Auth{enticateWithBasicAuth::class\,,orize::class\,},EnsureEmailIsVerified::class\,},RoutingMiddleware{ThrottleRequests::class\,,ValidateSignature::class\,}},README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ctif,gence_id,ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,c{heck_users.php,o{de,mposer{.{json,lock,phar},_info.txt},n{fig,trollers_{existants.txt,list.txt}}}},database{,_config.txt},e{mail,nv_{config.txt,sans_secrets.txt}},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},nom,p{a{ckage.json,ssword_hash},hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},o{le,utes{,_{api.txt,complet.txt}}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_a{pi.sh,uth.php},s},r{ans{action_model.txt,fer{_{controller.txt,request.txt},t.json}},ue\,}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        if ($montant <= 100000) return 1000;
        if ($montant <= 500000) return 2000;
        if ($montant <= 1000000) return 3000;
        return 5000;
    

