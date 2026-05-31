// public/main.js

// ページが読み込まれたら、自動的に現在保存されている日記を取得して表示する
document.addEventListener('DOMContentLoaded', fetchDiaries);

// フォームの送信イベントを監視する
document.getElementById('diary-form').addEventListener('submit', async (event) => {
  // ボタンを押したときにページがリロード（再読み込み）されるのを防ぐ
  event.preventDefault();

  // HTMLの入力フォームから値を取得する
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const rating = document.getElementById('rating').value;
  const impression = document.getElementById('impression').value; // 感想

  // サーバーに送るデータオブジェクトを作成
  // (server.jsが受け取れるように、感想は content というキー名にして送ります)
  const diaryData = {
    title: title,
    author: author,
    rating: rating,
    content: impression
  };

  try {
    // 1. Node.jsサーバーにPOSTリクエストでデータを送信
    const response = await fetch('/api/diaries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(diaryData) // JSON文字列に変換して送信
    });

    if (!response.ok) {
      throw new Error('サーバーエラーが発生しました');
    }

    const result = await response.json();
    alert(result.message); // 「保存しました！」とポップアップを出す

    // 2. フォームの入力欄をすべて空にする
    document.getElementById('diary-form').reset();

    // 3. 最新の日記一覧を再取得して画面を更新する
    fetchDiaries();

  } catch (error) {
    console.error('データの保存に失敗しました:', error);
    alert('保存に失敗しました。');
  }
});

// サーバーから日記一覧を取得してHTMLに表示する関数
async function fetchDiaries() {
  try {
    // Node.jsサーバーにGETリクエストを送る
    const response = await fetch('/api/diaries');
    const diaries = await response.json(); // サーバーから返ってきた配列データ

    const listContainer = document.getElementById('list-diary');
    listContainer.innerHTML = ''; // いったん表示をクリアする

    // 日記データがない場合の処理
    if (diaries.length === 0) {
      listContainer.innerHTML = '<p>まだ日記がありません。</p>';
      return;
    }

    // 配列のデータを1つずつループ処理してHTMLを組み立てる
    diaries.forEach(diary => {
      // 星型評価の見た目を作る (例: "5" -> "★★★★★")
      const stars = '★'.repeat(Number(diary.rating || 5)) + '☆'.repeat(5 - Number(diary.rating || 5));

      // 新しい日記用の要素(article)を作成
      const diaryItem = document.createElement('article');
      diaryItem.className = 'diary-item'; // CSSで装飾しやすいようにクラス名を付与

      // 中身のHTMLをセット (著者名や評価があれば表示する)
      diaryItem.innerHTML = `
        <h3>${diary.title}</h3>
        <p class="diary-meta">
          ${diary.author ? `<span>著者: ${diary.author}</span> | ` : ''}
          <span style="color: #ffcc00;">${stars}</span>
        </p>
        <p class="diary-content">${diary.content}</p>
        <button class="btn btn-delete" data-id="${diary.id}">この日記を削除する</button>
        <hr>
      `;
      // 2. 作成した削除ボタンに対して、クリックされたときのイベントを設定する
      const deleteBtn = diaryItem.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => {
        // 確認ダイアログを出して、OKなら削除関数を呼び出す
        if (confirm(`「${diary.title}」の日記を削除してもよろしいですか？`)) {
          deleteDiary(diary.id);
        }
      });


      // 画面のリストに追加する
      listContainer.appendChild(diaryItem);
    });

  } catch (error) {
    console.error('データの取得に失敗しました:', error);
  }
}

//サーバーに削除リクエストを送る関数
async function deleteDiary(id) {
  try {
    // URLの末尾に削除したいIDを付与して、DELETEメソッドで通信する
    const response = await fetch(`/api/diaries/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('削除に失敗しました');
    }

    const result = await response.json();
    alert(result.message);

    // 削除が成功したので、画面の一覧を最新状態に更新する
    fetchDiaries();

  } catch (error) {
    console.log('データの削除に失敗しました:', error);
    alert('エラーが発生しました');
  }
}
