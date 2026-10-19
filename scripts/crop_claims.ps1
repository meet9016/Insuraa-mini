Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new('C:\Users\11\.gemini\antigravity-ide\brain\9de87387-5871-4566-a183-74bd76e49669\.tempmediaStorage\media_1792220627022.png')
$rect = [System.Drawing.Rectangle]::new(1067, 465, 447, 260)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save('d:\Hitarthi\Insuraa-mini\public\images\landing\feat_claims.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()
$cropped.Dispose()
Write-Output "Done: $(Test-Path 'd:\Hitarthi\Insuraa-mini\public\images\landing\feat_claims.jpg')"
