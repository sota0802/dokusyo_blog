const express = require('express');
const app = express();
const PORT = 3000;

// フロントエンドからのリクエスト（JSONデータ）を解析できるようにする設定
app.use(express.json());

// 静的ファイル（HTMLやフロント側のJS）を「public」フォルダから配信する設定
app.use(express.static('public'));

// 擬似的なデータベース（日記のデータを保存する配列）
let diaries = [
    { id: 1, title: '最初のPosted', content: '今日はNode.jsを勉強した！' }
];

// 【READ】日記の一覧を取得するルート (GETリクエスト)
app.get('/api/diaries',(req,res) => {
  //フロントに日記のデータをjson形式で返す
  res.json(diaries);
});

app.post('/api/diaries', (req,res) => {
  const newDiary  = {
    id: diaries.length + 1,
    title: req.body.title,
    author: req.body.author,
    rating: req.body.rating,
    content: req.body.content
  };
  diaries.push(newDiary);

  res.json({message: '保存しました！', data: newDiary});

});

app.listen(PORT, () => {
  console.log( `Server is running on http://localhost:${PORT}`);
});
