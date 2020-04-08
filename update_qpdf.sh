rm -rf ./bin ./lib
wget https://github.com/qpdf/qpdf/releases/download/release-qpdf-10.0.0/qpdf-10.0.0-x86_64.AppImage -O qpdf.AppImage
./qpdf.AppImage --appimage-extract
mkdir -p ./bin ./lib
cp -R squashfs-root/usr/bin/* ./bin/
cp -R squashfs-root/usr/lib/* ./lib/
rm -rf squashfs-root qpdf.AppImage
