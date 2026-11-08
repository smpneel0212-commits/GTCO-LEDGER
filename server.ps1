$port = 8085
$folder = "C:\Users\Hp\.gemini\antigravity\scratch\GTCO-LEDGER"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "/index.html"
        }

        $localFilePath = Join-Path $folder ($urlPath.TrimStart('/').Replace('/', '\'))
        if (Test-Path $localFilePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            if ($localFilePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($localFilePath.EndsWith(".js")) { $response.ContentType = "application/javascript; charset=utf-8" }
            elseif ($localFilePath.EndsWith(".css")) { $response.ContentType = "text/css; charset=utf-8" }
            elseif ($localFilePath.EndsWith(".json")) { $response.ContentType = "application/json; charset=utf-8" }
            else { $response.ContentType = "application/octet-stream" }

            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $err.Length
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.Close()
    } catch {
        # ignore and continue
    }
}
