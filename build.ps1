$hhc = "C:\Program Files (x86)\HTML Help Workshop\hhc.exe"
$zip = "C:\Program Files\7-Zip\7z.exe"
$version = "1.0.0"
$logoScVersion = "8.4"
$buildDir = ".\build"
$distDir = ".\dist"
$srcDir = ".\src"
if (Test-Path $buildDir) {
	Remove-Item -Path $buildDir
}

New-Item -ItemType Directory -Force -Path $buildDir
New-Item -ItemType Directory -Force -Path $distDir

& $hhc "$srcDir\help\Help_pl-PL.hhp"

$buildArt = "$buildDir\Help_pl_PL.zip"
$compress = @{
	Path = "$srcDir\help\*"
	CompressionLevel = "Optimal"
	DestinationPath = $buildArt
}
# Compress-Archive @compress
& $zip a $buildArt "$srcDir\help\*"

$buildDirDist = "$buildDir/dist"
New-Item -ItemType Directory -Path $buildDirDist
New-Item -ItemType Directory -Path "$buildDirDist\help"
Move-Item -Path $buildArt -Destination "$buildDirDist\help\Help_pl_PL.jar" -Force
Copy-Item -Path "$srcDir\Language_pl_PL.properties" -Destination "$buildDirDist\Language_pl_PL.properties"
Copy-Item -Path "$buildDirDist\*" -Destination "$distDir\" -Recurse -Force

$distZipName = "spolszczenie-$version-logo-$logoScVersion.zip"
$distZip = "$distDir\$distZipName"

if (Test-Path $distZip) {
	Remove-Item -Path $distZip
}

$compress = @{
	Path = $buildDirDist
	CompressionLevel = "Optimal"
	DestinationPath = $distZip
}
#Compress-Archive @compress
& $zip a $distZip $buildDirDist

Remove-Item -Path $buildDir -Recurse
