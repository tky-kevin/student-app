const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000; // 修改：為了適應 Render 的自動設定

// 1. Middleware
app.use(express.json());
app.use(express.static('public'));

// 2. 資料庫連線 (稍後我們會將這裡換成雲端網址)
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentDB';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB 連接成功'))
    .catch(err => console.error('MongoDB 連接失敗:', err));

// 3. 定義 Model
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String
});
const Student = mongoose.model('Student', studentSchema);

// 4. API 實作

// GET: 取得所有學生
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: 新增學生
app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [BONUS] DELETE: 刪除學生
app.delete('/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [BONUS] PUT: 更新學生
app.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // 回傳更新後的資料
        );
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});