<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de transaction</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { color: #1a56db; }
        .info { margin: 10px 0; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <h2>🏦 Makonon-Transfert</h2>
    <h3>Reçu de transaction</h3>
    <hr>

    <div class="info"><span class="label">ID:</span> {{ $transaction->id }}</div>
    <div class="info"><span class="label">Montant:</span> {{ number_format($transaction->amount, 0, ',', ' ') }} FCFA</div>
    <div class="info"><span class="label">Receveur:</span> {{ $transaction->receiver }}</div>
    <div class="info"><span class="label">Agence:</span> {{ $transaction->agency_id }}</div>
    <div class="info"><span class="label">Statut:</span> {{ $transaction->status }}</div>
    <div class="info"><span class="label">Date:</span> {{ $transaction->created_at }}</div>

    <hr>
    <p style="text-align: center; color: #666; font-size: 12px;">
        Merci d'avoir utilisé Makonon-Transfert
    </p>
</body>
</html>
