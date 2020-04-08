wget https://github.com/qpdf/qpdf/releases/download/release-qpdf-9.1.1/qpdf-9.1.1-x86_64.AppImage -O qpdf.AppImage
./qpdf.AppImage --appimage-extract
cp -R squashfs-root/usr/bin/* ./bin/
cp -R squashfs-root/usr/lib/* ./lib/
rm -rf squashfs-root qpdf.AppImage
