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

// 【DELETE】特定の日記を削除するルート
app.delete('/api/diaries/:id',(req, res) => {
  // URLから削除したい日記のIDを取得する (例: "/api/diaries/2" なら id は 2)
  const deleteID = Number(req.params.id);

  // 指定されたID以外のデータだけで、新しい配列を作り直す（＝指定されたIDが消える）
  const initialLength = diaries.length;
  diaries = diaries.filter(diary => diary.id !== deleteID);

  // 削除前後で配列の数が変わっていれば成功
  if (diaries.length < initialLength) {
    res.json({message: '日記を削除しました！'});
  } else {
    // もし指定されたIDが見つからなかった場合
    res.status(404).json({ message: '指定された日記が見つかりませんでした。' });
  }
});

app.listen(PORT, () => {
  console.log( `Server is running on http://localhost:${PORT}`);
});
