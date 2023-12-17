const postsList = document.getElementById('posts-list');
const selectUsers = document.getElementById('post-user');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const modalCloseButton = document.getElementById('close-btn');
const addButton = document.getElementById('create-post');

let emptyPost;
let users;
let posts;

const getPost = (post, users) => {
  const newPost = document.createElement('div');
  newPost.classList =
    'container px-4 py-4 bg-gray-800 rounded-md border-2 border-gray-200 justify-self-center w-[90%] md:w-full';
  newPost.setAttribute('key', post.id);
  newPost.setAttribute('userId', post.userId);

  const title = document.createElement('h2');
  title.classList = 'w-full text-center font-semibold text-xl mb-4';
  title.innerText = post.title;

  newPost.appendChild(title);

  newPost.appendChild(document.createElement('hr'));

  const para = document.createElement('p');
  para.classList = 'mt-4 para';
  para.innerText = post.body;

  newPost.appendChild(para);

  const footer = document.createElement('div');
  footer.classList = 'flex justify-between items-center';

  const name = document.createElement('span');
  name.classList = 'text-gray-400 text-left block mt-2 flex flex-col';
  name.innerText = users[post.userId - 1].name;

  footer.appendChild(name);

  const buttons = document.createElement('div');
  buttons.classList = 'select-none w-12 flex justify-between';

  const editButton = document.createElement('button');
  editButton.classList = 'active:text-yellow-300 active:scale-90 edit-button';
  const penIcon = document.createElement('i');
  penIcon.classList = 'fa-solid fa-pen';
  editButton.appendChild(penIcon);

  buttons.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList = 'active:text-red-400 active:scale-90 delete-button';
  const trashIcon = document.createElement('i');
  trashIcon.classList = 'fa-solid fa-trash';
  deleteButton.appendChild(trashIcon);

  buttons.appendChild(deleteButton);

  footer.appendChild(buttons);

  newPost.appendChild(footer);

  return newPost;
};

const getUsersInSelect = (users) => {
  users.forEach((user) => {
    const option = document.createElement('option');
    option.setAttribute('value', user.id);
    option.innerText = user.name;

    selectUsers.appendChild(option);
  });
};

const addPostsToDOM = async () => {
  users = await fetch('https://jsonplaceholder.typicode.com/users').then(
    (res) => res.json()
  );
  posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(
    (res) => res.json()
  );

  posts.forEach((post) => {
    postsList.appendChild(getPost(post, users));
  });

  getUsersInSelect(users);

  loader.classList.add('hidden');

  emptyPost = getPost({
    id: users.length + 1,
    title: '',
    body: '',
    userId: 1
  }, users)
};

function handleClick(e) {
  if (e.target.parentNode.classList.contains('edit-button')) {
    const post = e.target.parentNode.parentNode.parentNode.parentNode;
    showModal(post)
  } else if (e.target.parentNode.classList.contains('delete-button')) {
    const post = e.target.parentNode.parentNode.parentNode.parentNode;
    deletePost(post);
  }
}

function showModal(post) {
  const title = document.querySelector('#post-title') 
  title.value = post.querySelector('h2').innerText;
  const body = document.querySelector('#post-body')
  body.value = post.querySelector('p').innerText;
  const select = document.getElementById('post-user')
  select.selectedIndex = post.getAttribute('userId') - 1;
  modal.classList.replace('hidden', 'block');
}

function deletePost(post) {
  fetch(
    `https://jsonplaceholder.typicode.com/posts/${post.getAttribute('key')}`,
    {
      method: 'DELETE',
    }
  ).then(() => postsList.removeChild(post));
}

function createPost() {
  const post = {
    title: modal.getElementById('post-title').value,
    body: modal.getElementById('post-body').value,
  }

  fetch(`https://jsonplaceholder.typicode.com/posts`,
  {
    method: 'POST',
    body: JSON.stringify({

    })
  })
}

function closeModal(e) {
  e.preventDefault()
  modal.classList.replace('block', 'hidden')
  const title = document.querySelector('#post-title') 
  title.value = '';
  const body = document.querySelector('#post-body')
  body.value = '';
  const select = document.getElementById('post-user')
  select.selectedIndex = 0;
}

function init() {
  document.addEventListener('DOMContentLoaded', addPostsToDOM);
  postsList.addEventListener('click', handleClick);
  addButton.addEventListener('click', () => showModal(emptyPost))
  modalCloseButton.addEventListener('click', closeModal);
}

init();
