$srcDir = "D:\! A Workspace\Anitygravity_workspace\.WebappProjects\somtam-foodordering-webapp\src"
$destDir = "D:\! A Workspace\Anitygravity_workspace\.WebappProjects\somtam-foodordering-webapp\public\menu"

If (!(Test-Path -Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

$mappings = @{
    "ขนมจีน[20].jpg" = "khanom-jeen.jpg";
    "ข้าวสวย[15].jpg" = "steamed-rice.jpg";
    "ข้าวเหนียว[15].jpg" = "sticky-rice.jpg";
    "คอหมูย่าง[70].jpg" = "grilled-pork-neck.jpg";
    "ตำกุ้งสด[80].jpg" = "somtam-fresh-shrimp.jpg";
    "ตำข้าวโพด[50].jpg" = "corn-somtam.jpg";
    "ตำปูปลาร้า[80].jpg" = "somtam-pu-plara.jpg";
    "ตำไทย[50].jpg" = "thai-somtam.jpg";
    "ตำไทยไข่เค็ม[60].jpg" = "thai-somtam-salted-egg.jpg";
    "ต่ำถั่ว[50].jpg" = "long-bean-somtam.jpg";
    "น้ำตกหมู[60].jpg" = "nam-tok-moo.jpg";
    "ปีกไก่ทอดน้ำปลา[60].jpg" = "fried-chicken-wings.jpg";
    "ลาบหมู[60].jpg" = "larb-moo.jpg";
    "หมูแดดเดียว[60].jpg" = "sun-dried-pork.jpg";
    "ไก่ย่าง[60].jpg" = "grilled-chicken.jpg";
}

foreach ($key in $mappings.Keys) {
    $srcPath = Join-Path $srcDir $key
    $destPath = Join-Path $destDir $mappings[$key]
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $destPath -Force
        Write-Host "Copied $key to $($mappings[$key])"
    } else {
        Write-Host "Not found: $srcPath"
    }
}
