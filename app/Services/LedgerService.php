<?php

namespace AppServices;

use AppModelsLedger;
use AppModelsAgence;
use AppExceptionsFondsInsuffisantsException;
use IlluminateSupportFacadesDB;
use IlluminateSupportFacadesLog;
use IlluminateSupportStr;

class LedgerService
{\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
    public const SYSTEM_AGENCE_CODE = 'SYSTEM';
    public const FRAIS_AGENCE_CODE = 'FRAIS';
    public const CAISSE_AGENCE_CODE = 'CAISSE';

    public function getSystemAccount(): Agence
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $system = Agence::where('code', self::SYSTEM_AGENCE_CODE)->first();
        if (!$system) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newRuntimeException("Compte système non trouvé");
        
        return $system;
    

    public function getFraisAccount(): Agence
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $frais = Agence::where('code', self::FRAIS_AGENCE_CODE)->first();
        if (!$frais) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newRuntimeException("Compte frais non trouvé");
        
        return $frais;
    

    public function getCaisseAccount(): Agence
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $caisse = Agence::where('code', self::CAISSE_AGENCE_CODE)->first();
        if (!$caisse) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newRuntimeException("Compte caisse non trouvé");
        
        return $caisse;
    

    /**
     *  CREDIT - SANS TRANSACTION (gérée par l'appelant)
     */
    public function credit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $this->validerMontant($montant);

        $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

        $soldeAvant = $this->calculerSoldeReel($agence->id);
        $soldeApres = $soldeAvant + $montant;

        return Ledger::create(            'agence_id' => $agence->id,
            'transfert_id' => $transfertId,
            'type' => 'CREDIT',
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId,
            'reference' => $reference ?? Str::uuid()->toString(),
            'description' => $description ?? $nature,
        );
    

    /**
     *  DEBIT - SANS TRANSACTION (gérée par l'appelant)
     */
    public function debit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $this->validerMontant($montant);

        $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

        $soldeAvant = $this->calculerSoldeReel($agence->id);
        $soldeApres = $soldeAvant - $montant;

        if ($soldeApres < 0 && !in_array($agence->code, elf::SYSTEM_AGENCE_CODE, self::FRAIS_AGENCE_CODE, self::CAISSE_AGENCE_CODE)) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw new FondsInsuffisantsException($soldeAvant, $montant);
        

        return Ledger::create(            'agence_id' => $agence->id,
            'transfert_id' => $transfertId,
            'type' => 'DEBIT',
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId,
            'reference' => $reference ?? Str::uuid()->toString(),
            'description' => $description ?? $nature,
        );
    

    public function debitSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->debit($this->getSystemAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    

    public function creditSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->credit($this->getSystemAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    

    public function debitFrais(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->debit($this->getFraisAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    

    public function creditFrais(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->credit($this->getFraisAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    

    public function debitAgence(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->debit($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    

    public function creditAgence(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->credit($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    

    public function getSolde(int $agenceId): float
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        return $this->calculerSoldeReel($agenceId);
    

    /**
     *  Calcul correct du solde (DEBIT - CREDIT)
     */
    private function calculerSoldeReel(int $agenceId): float
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $result = Ledger::where('agence_id', $agenceId)
            ->select(DB::raw('
                COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = "DEBIT" THEN montant ELSE 0 END), 0)
                as solde
            '))
            ->first();
        
        return (float) ($result->solde ?? 0);
    

    /**
     *  Met à jour solde_cache pour une agence
     *  Appelée UNE SEULE FOIS après toutes les écritures
     */
    public function mettreAJourSoldeCache(int $agenceId): void
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $solde = $this->calculerSoldeReel($agenceId);
        
        Agence::where('id', $agenceId)->update(            'solde_cache' => $solde
        );
    

    public function verifierDoubleEcriture(?int $transfertId): void
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        if ($transfertId === null) return;

        $totalDebit = (float) Ledger::where('transfert_id', $transfertId)->where('type', 'DEBIT')->sum('montant');
        $totalCredit = (float) Ledger::where('transfert_id', $transfertId)->where('type', 'CREDIT')->sum('montant');

        if (abs($totalDebit - $totalCredit) > 0.01) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newRuntimeException("Incohérence ledger: DEBIT=$totalDebit, CREDIT=$totalCredit");
        
    

    public function verifierSystemNul(): void
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $system = $this->getSystemAccount();
        $solde = $this->getSolde($system->id);
        if (abs($solde) > 0.01) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newRuntimeException("Solde SYSTEM non nul: $solde");
        
    

    public function verifierSoldeCache(int $agenceId): void
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        $agence = Agence::find($agenceId);
        if (!$agence) return;
        
        $soldeLedger = $this->calculerSoldeReel($agenceId);
        $soldeCache = $agence->solde_cache ?? 0;
        
        if (abs($soldeCache - $soldeLedger) > 0.01) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            Log::warning(" Solde_cache désynchronisé",                 'agence' => $agence->code,
                'cache' => $soldeCache,
                'ledger' => $soldeLedger,
                'écart' => $soldeCache - $soldeLedger
            );
            
            $agence->update(solde_cache' => $soldeLedger);
        
    

    private function validerMontant(float $montant): void
    {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
        if ($montant <= 0) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newInvalidArgumentException("Le montant doit être supérieur à 0");
        
        if ($montant > 999999999.99) {\,,-,.{e{ditorconfig,nv{,.example}},git{,attributes,ignore}},123456789\,,2\,,3\,,5000\,,987654321\,,README.md,T{est{\,,2\,},ransfert\ {créé\ avec\ succès\,,retiré\ avec\ succès\,}},a{ll_php_files.txt,pp{,_{all_files.txt,config.txt,structure.txt}},rtisan,uth_controller.txt},bootstrap,co{de,mposer{.{json,lock},_info.txt},n{fig,trollers_{existants.txt,list.txt}}},database{,_config.txt},env_{config.txt,sans_secrets.txt},ledger_{model.txt,service.txt},m{igrations_{completes.txt,list.txt},odels_{existants.txt,list.txt}},p{ackage.json,hpunit.xml,roject_{analysis,structure.txt},ublic},r{e{quests_{existants.txt,list.txt},sources},outes{,_{api.txt,complet.txt}}},s{ervices_{existants.txt,list.txt},t{orage,ructure{.txt,_{complete.txt,detaille.txt,windows.txt}}}},t{\ {Global\"\,,global\ annulation\"\}\'\)},est{-api.php,_auth.php,s},rans{action_model.txt,fer{_{controller.txt,request.txt},t.json}}},user_model.txt,v{endor,ite.config.js},wallet_{controller.txt,model.txt}} 
            throw newInvalidArgumentException("Montant trop élevé");
        
    

