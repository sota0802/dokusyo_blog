document.addEventListener("DOMContentLoaded", () => {
  const diaryForm = document.getElementById("diary-form");
  const listDiary = document.getElementById("list-diary");

  diaryForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const ratingValue = document.getElementById("rating").value;
    const impression = document.getElementById("impression").value;

    const ratingStars = "★".repeat(Number(ratingValue)) + "☆".repeat(5 - Number(ratingValue));

    // 4. 追加するHTMLを組み立てる
    const cardHtml = `
    <article class="diary-card">
      <div class="card-header">
        <h3>${title}</h3>
        <span class="badge">${ratingStars}</span>
      </div>
      <p class="author">著者: ${author}</p>
      <p class="impression">${impression}</p>
      <div class="card-actions">
        <button class="btn btn-edit">編集</button>
        <button class="btn btn-delete">削除</button>
      </div>
    </article>
    `;

    listDiary.insertAdjacentHTML('beforeend', cardHtml);

    diaryForm.reset();
  });
});
