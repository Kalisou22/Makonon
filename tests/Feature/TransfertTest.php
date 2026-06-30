<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Agence;
use App\Models\Compte;
use App\Services\LedgerService;
use App\Services\TransfertService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransfertTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $ag1;
    protected $ag2;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->ag1 = Agence::factory()->create(['code' => 'AG001']);
        $this->ag2 = Agence::factory()->create(['code' => 'AG002']);
    }

    public function test_transfert_ok()
    {
        $ledger = app(LedgerService::class);
        $service = app(TransfertService::class);

        $ledger->credit($this->ag1, 100000, 'AJUSTEMENT', null, $this->user->id);

        $transfert = $service->creer([
            'nom_expediteur' => 'Test',
            'telephone_expediteur' => '777000000',
            'nom_beneficiaire' => 'Test2',
            'telephone_beneficiaire' => '888000000',
            'montant' => 60000,
            'agence_envoi_id' => $this->ag1->id,
            'agence_destinataire_id' => $this->ag2->id,
            'idempotency_key' => 'test_' . time()
        ], $this->user);

        $this->assertNotNull($transfert);
        $this->assertEquals('ENVOYE', $transfert->statut);
    }

    public function test_fonds_insuffisants()
    {
        $this->expectException(\App\Exceptions\FondsInsuffisantsException::class);

        $service = app(TransfertService::class);
        $service->creer([
            'nom_expediteur' => 'Test',
            'telephone_expediteur' => '777000000',
            'nom_beneficiaire' => 'Test2',
            'telephone_beneficiaire' => '888000000',
            'montant' => 60000,
            'agence_envoi_id' => $this->ag1->id,
            'agence_destinataire_id' => $this->ag2->id,
            'idempotency_key' => 'test_' . time()
        ], $this->user);
    }

    public function test_idempotence()
    {
        $ledger = app(LedgerService::class);
        $service = app(TransfertService::class);

        $ledger->credit($this->ag1, 100000, 'AJUSTEMENT', null, $this->user->id);

        $key = 'idempotent_' . time();

        $t1 = $service->creer([
            'nom_expediteur' => 'Idem1',
            'telephone_expediteur' => '777000001',
            'nom_beneficiaire' => 'Idem2',
            'telephone_beneficiaire' => '888000001',
            'montant' => 1000,
            'agence_envoi_id' => $this->ag1->id,
            'agence_destinataire_id' => $this->ag2->id,
            'idempotency_key' => $key
        ], $this->user);

        $t2 = $service->creer([
            'nom_expediteur' => 'Idem1',
            'telephone_expediteur' => '777000001',
            'nom_beneficiaire' => 'Idem2',
            'telephone_beneficiaire' => '888000001',
            'montant' => 1000,
            'agence_envoi_id' => $this->ag1->id,
            'agence_destinataire_id' => $this->ag2->id,
            'idempotency_key' => $key
        ], $this->user);

        $this->assertEquals($t1->id, $t2->id);
    }
}
