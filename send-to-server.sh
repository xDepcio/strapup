tar --exclude='*/node_modules' --exclude='*/.git' --exclude='*/.contentlayer' --exclude='*/.next' -czvf archive_name.tar.gz *
scp archive_name.tar.gz adrwal@192.168.0.24:~/

ssh adrwal@192.168.0.24 << 'ENDSSH'
rm -rf ~/strapup
mkdir ~/strapup
mv archive_name.tar.gz ~/strapup
cd ~/strapup
tar -xzvf archive_name.tar.gz
rm archive_name.tar.gz
ENDSSH

rm archive_name.tar.gz
