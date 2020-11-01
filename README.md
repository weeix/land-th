# land-th

สิ่งที่ต้องติดตั้ง:
- nodejs 14
- truffle

การแก้ปัญหาเบื้องต้น:
- จะทำอย่างไร หากพบข้อความ "/app/src/contracts/LandTH.json loaded." แล้ว แต่ smart contract ไม่ทำงาน

  **ใช้คำสั่ง `docker-compose down -v` ลบโฟลเดอร์ _client/src/contracts_ และ _server/src/contracts_ จากนั้นจึงเริ่มการทำงานอีกครั้ง**

- เมื่อเพิ่มรูปแปลงแล้ว ได้รับแจ้งเตือนว่า Transaction Failed

  **ดู Revert reason ใน terminal**