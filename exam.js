const PAGE = {
  questions: [
    {
      id: 1,
      title: "4%2的值为？",
      options: [0, 1, 2, 4],
      correct: 0,
    }, {
      id: 2,
      title: "\"0\" == false 的值为",
      options: ["true", "false"],
      correct: 0,
    },
    {
      id: 3,
      title: "不设置cookie设置过期时间，cookie的默认时间长度为",
      options: ["立刻过期", "永不过期", "cookie 无法设置", "在浏览器会话结束时过期"],
      correct: 3,
    },
    {
      id: 4,
      title: "+new Array(042) 的值为",
      options: ["43", "NaN", "42", "Error"],
      correct: 1,
    },
    {
      id: 5,
      title: "数组的方法中，哪些方法不能改变自身数组？",
      options: ["pop", "splice", "sort", "concat"],
      correct: 3,
    },
    {
      id: 6,
      title: "Number(null); 的值为：",
      options: ["null", 0, "undefined", 1],
      correct: 1,
    }
  ],
  currentId: 1,
  userAnswers: [],
  render: function () {
    let questions = PAGE.questions;
    let total = PAGE.questions.length;
    var currentId = PAGE.currentId;
    $('.questions-container').empty();
    var currentQuestion = questions.filter(item => item.id === currentId)[0];
    var correctAnswer = currentQuestion.correct;
    //$(currentQuestion).each((index,item)=> {
    //item.index=index;});
    let optionsList = currentQuestion.options.map((option, index) => { return `<li class="option-list" data-index="${index}">${option}</li>` });
    let questionPage = `<div class="question-item"><div class="progress"></div><span class="question-number">${currentId}/${total}</span><span class="question">${currentQuestion.title}</span><ul class="answers">${optionsList.join('')}</ul></div>`;
    $('.questions-container').html(questionPage);
    switch (currentId) {
      case 1:
        var navContainer = `<div class="nav-container"><span class="checked">检查</span><span class="next">下一题</span></div><span class="notice">请选择一个选项！</span></div>`
        break;
      case total:
        var navContainer = `<div class="nav-container"><span class="prev">上一题</span><span class="checked">检查</span><span class="final">提交</span></div><span class="notice">请选择一个选项！</span></div>`
        break;
      default:
        var navContainer = `<div class="nav-container"><span class="prev">上一题</span><span class="checked">检查</span><span class="next">下一题</span></div><span class="notice">请选择一个选项！</span></div>`
        break;
    }
    $('.question-item').append(navContainer);
  },
  final:function(){
    $('.questions-container').remove();
    $('.results-container').show();
    let userAnswers=PAGE.userAnswers;
    let total = PAGE.questions.length;
    let num=userAnswers.filter(option=>option.result=='correct').length;
    let numStr=(100.00/total*num).toString()
    let index=numStr.indexOf('.')
    if(index<0){
      index=0;
    }
    console.log(numStr);
    let resultList= userAnswers.map(option => { return `<li class="${option.result}">${option.questionID}<span></span></li>` });
    let resultPage =`<span class="question-number">已结束!</span><div class="result-keeper"><h2 class="qTitle">您的成绩为${Number(numStr.slice(0,index+3))}</h2><ul class="result-list">${resultList.join('')}</ul></div>`;
    $('.results-container').html(resultPage);
  }
};
$(function () {
  PAGE.render();
  function init() {
    if (!($('.option-list').hasClass('correct') || $('.option-list').hasClass('wrong'))) {
      $('.answers').on('click', '.option-list', selected);
    }
    $('.checked').on('click', checked);
    $('.nav-container').on('click', '.next', next);
    $('.nav-container').on('click', '.prev', prev);
    $('.nav-container').on('click', '.final', finalSumbit);
  }
  $('.answers').on('click', '.option-list', selected);
  init();
  function selected() {
    $('.notice').hide();
    $('.option-list.selected').removeClass('selected');
    $(this).addClass('selected');
  }
  //检查结果是否正确
  function checked() {
    if ($('.option-list').hasClass('selected')) {
      let questions = PAGE.questions;
      let currentId = PAGE.currentId;
      let currentQuestion = questions.filter(item => item.id === currentId)[0];
      let correctAnswer = currentQuestion.correct;
      let selectedID = Number($('.option-list.selected').attr('data-index'));
      if (selectedID === correctAnswer) {
        $('.option-list.selected').addClass('correct');
      } else {
        $('.option-list.selected').addClass('wrong');
      }
      $('.answers').off('click', '.option-list', selected);
      $('.checked').off('click', checked);
      setStatus();
    } else {
      $('.notice').show();
    }
  }
  function next() {
    if ($('.option-list').hasClass('selected')) {
      let currentId = PAGE.currentId;
      setStatus();
      PAGE.currentId = currentId + 1;
      PAGE.render();
      init();
      status();
    } else {
      $('.notice').show();
    }

  }
  function prev() {
    let currentId = PAGE.currentId;
    PAGE.currentId = currentId - 1;
    PAGE.render();
    init();
    status();
    setStatus();
  }
  function setStatus() {
    let userAnswers = PAGE.userAnswers;
    let questions = PAGE.questions;
    let currentId = PAGE.currentId;
    let currentQuestion = questions.filter(item => item.id === currentId)[0];
    let correctAnswer = currentQuestion.correct;
    let userOptionItem = userAnswers.filter(item => item.questionID === currentId)[0];
    if (!($('.option-list').hasClass('correct') || $('.option-list').hasClass('wrong'))) {
      if (userOptionItem) {
        userOptionItem.userChoice = $('.option-list.selected').attr('data-index');
        userOptionItem.result =($('.option-list.selected').attr('data-index')== correctAnswer) ? 'correct' : 'wrong';
        console.log(userAnswers);
      } else {
        userAnswers.push({ questionID: currentId, userChoice: $('.option-list.selected').attr('data-index'), checked: false, result:($('.option-list.selected').attr('data-index')== correctAnswer) ? 'correct' : 'wrong' });
      }
    } else {
      if (userOptionItem) {
        userOptionItem.userChoice = $('.option-list.selected').attr('data-index');
        userOptionItem.result =($('.option-list.selected').attr('data-index')== correctAnswer) ? 'correct' : 'wrong';
        userOptionItem.checked = true;
        console.log(userAnswers);
      } else {
        userAnswers.push({ questionID: currentId, userChoice: $('.option-list.selected').attr('data-index'), checked: true, result: ($('.option-list.selected').attr('data-index')== correctAnswer) ? 'correct' : 'wrong' });
      }
    }
    PAGE.userAnswers= userAnswers;
  }
  function status() {
    let currentId = PAGE.currentId;
    let userAnswersItem = PAGE.userAnswers.filter(item => item.questionID === currentId)[0];
    if (userAnswersItem) {
      let optionStatus = $(`.option-list[data-index=${userAnswersItem.userChoice}]`);
      if (userAnswersItem.checked) {
        optionStatus.addClass('selected ' + userAnswersItem.result);
        $('.answers').off('click', '.option-list', selected);
      } else {
        optionStatus.addClass('selected');
      }
    }
  }
  $('.nav-container').on('click', '.final', finalSumbit);
  function finalSumbit(){
    if ($('.option-list').hasClass('selected')) {
      status();
      init();
      setStatus();
      PAGE.final();
    } else {
      $('.notice').show();
    }

  }
})