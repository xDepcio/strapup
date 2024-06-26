tar --exclude='*/node_modules' --exclude='*/.git' --exclude='*/.contentlayer' --exclude='*/.next' -czvf archive_name.tar.gz *
scp archive_name.tar.gz adrwal@192.168.0.24:~/strapup

ssh adrwal@192.168.0.24 << 'ENDSSH'
cd ~/strapup
tar -xzvf archive_name.tar.gz
rm archive_name.tar.gz
ENDSSH

rm archive_name.tar.gz
