$xmlSettings = New-Object System.XMl.XmlWriterSettings;
$xmlSettings.Indent = $true; # 开启缩进
$xmlSettings.IndentChars = ("`t"); # 使用制表符缩进
$xmlSettings.OmitXmlDeclaration = $true; # 省略XML声明
$xmlWriter = [System.XML.XmlWriter]::Create("..\icon-awoken.svg", $xmlSettings);
# Write the XML Decleration and set the XSL
$xmlWriter.WriteStartDocument();
# Start the Root Element
$xmlWriter.WriteStartElement("svg", 'http://www.w3.org/2000/svg'); # 添加根节点

add-type -AssemblyName System.Drawing; # 要有这一行才能用Image
$directory = "awokens";
Get-ChildItem $directory | # 读取所有子文件，
Sort-Object {[int]$_.basename} | # 按文件名的数字排序
ForEach-Object  -Process{
    if($_ -is [System.IO.FileInfo])
    {
        Write-Host "正在处理" $_;
        $content = get-content $_.FullName -encoding byte;
        $base64 = [convert]::ToBase64String($content);
        $mime = file --mime-type -b $_.FullName;
        $id = [int]$_.basename;
        $image = New-Object System.Drawing.Bitmap $_.FullName;
        $xmlWriter.WriteStartElement("symbol"); # <-- Start <Object>
            $xmlWriter.WriteAttributeString("id", "awoken-"+$id);
            $xmlWriter.WriteAttributeString("viewBox", "0 0 32 32");
            $xmlWriter.WriteStartElement("image") # <-- Start <SubObject> 
                $xmlWriter.WriteAttributeString("width", $image.Width);
                $xmlWriter.WriteAttributeString("height", $image.Height);
                $xmlWriter.WriteAttributeString("href","data:"+$mime+";base64,"+$base64);
            $xmlWriter.WriteEndElement() # <-- End <SubObject>
        $xmlWriter.WriteEndElement() # <-- End <Object>
    }
};

$xmlWriter.WriteEndElement() # 结束根节点
# End, Finalize and close the XML Document
$xmlWriter.WriteEndDocument()
$xmlWriter.Flush()
$xmlWriter.Close()