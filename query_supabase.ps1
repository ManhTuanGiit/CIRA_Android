$token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcmVhYmpuemp1YmRxcHdmeXJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk2MDc5MSwiZXhwIjoyMDc5NTM2NzkxfQ.drdWSNkBO_eBX8kb8ZsWZzHj8JektujaWQiktVTKDuw'

$headers = @{
    'apikey'        = $token
    'Authorization' = "Bearer $token"
    'Content-Type'  = 'application/json'
}

# Use Supabase Management API to list tables via PostgREST OpenAPI spec
$response = Invoke-RestMethod -Uri 'https://vireabnjzjubdqpwfyrq.supabase.co/rest/v1/' -Headers $headers -Method Get

Write-Host "=== Tables available via PostgREST ==="
$response.definitions.PSObject.Properties.Name | Sort-Object | ForEach-Object {
    Write-Host "  - $_"
}
