<?php
namespace App\Services;
use App\Models\Ledger;
use App\Models\Agence;
use Illuminate\Support\Facades\DB;
class LedgerService
{
    public function debit($agenceId,$montant,$nature,$transfertId,$userId,$reference){return DB::transaction(function()use($agenceId,$montant,$nature,$transfertId,$userId,$reference){$agence=Agence::where("id",$agenceId)->lockForUpdate()->first();if(!$agence)throw new \Exception("Agence non trouvee");if($agence->solde_cache<$montant)throw new \Exception("Solde insuffisant");$soldeAvant=$agence->solde_cache;$agence->solde_cache-=$montant;$agence->save();return Ledger::create(["agence_id"=>$agenceId,"transfert_id"=>$transfertId,"type"=>"DEBIT","nature"=>$nature,"montant"=>$montant,"solde_avant"=>$soldeAvant,"solde_apres"=>$agence->solde_cache,"utilisateur_id"=>$userId,"reference"=>$reference]);});}
    public function credit($agenceId,$montant,$nature,$transfertId,$userId,$reference){return DB::transaction(function()use($agenceId,$montant,$nature,$transfertId,$userId,$reference){$agence=Agence::where("id",$agenceId)->lockForUpdate()->first();if(!$agence)throw new \Exception("Agence non trouvee");$soldeAvant=$agence->solde_cache;$agence->solde_cache+=$montant;$agence->save();return Ledger::create(["agence_id"=>$agenceId,"transfert_id"=>$transfertId,"type"=>"CREDIT","nature"=>$nature,"montant"=>$montant,"solde_avant"=>$soldeAvant,"solde_apres"=>$agence->solde_cache,"utilisateur_id"=>$userId,"reference"=>$reference]);});}
}
