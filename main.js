
var controller = {
  saved: [0,0,0,0,0,0],
  unSaved: [0,0,0,0,0,0],
  ach: [0,0,0,0,0,0,0,0,0,0,0],
  count: 0,
  numOfRolls: 3,
  points: [0,0,0,0,0,0,0,0,0,0,0],
  gameFinish: false,
  init: ()=> {
    controller.newRound();
  },
  newRound: function(){
    for(i=0;i<this.unSaved.length;i++){
      let newDice = controller.newDice();
      this.unSaved[i] = newDice;
      view.renderDice(i, newDice);
    }
  controller.count++;
  view.renderBtn();
  },
  endRound: function(){
   this.resetDiceList(this.unSaved, 0);
   this.resetDiceList(this.saved, 10);
   controller.count = 0;
   //if then newRound
   if (controller.CheckForGameFinish()){
     console.log('game is over');
   } else {   
     controller.newRound();
    console.log('newRound() will be called');
   }
  },
  move: (id)=>{
    if (id<6){
      if(controller.unSaved[id]>0){
        //move to saved
        controller.saved[id] = controller.unSaved[id];
        let newId = (parseInt(id)+10);
        view.renderDice(newId, controller.unSaved[id]);
        controller.unSaved[id]=0;
        view.renderDice(id, 0);
        controller.checkAchievement();
      }
    }
    else if (id>9) {
      if(controller.saved[(id-10)]>0){
        //move to unSaved
        let newId = (parseInt(id)-10);
        controller.unSaved[newId] = controller.saved[newId];
        view.renderDice(newId, controller.saved[newId])
        controller.saved[newId]=0;
        view.renderDice(id, 0);
        controller.checkAchievement();
      }
    }
  },
  resetDiceList: (list, factor)=>{
    for(i=0;i<list.length;i++){
      list[i]=0;
      let id = parseInt(i + factor);
      view.renderDice(id, 0);
    }
  },
  newDice: function(){
    return (Math.floor(Math.random()*6)+1);
  },
  checkAchievement: ()=>{
    function isValid(value){
      return value > 0;
    }
    let filtered = controller.saved.filter(isValid);
    let list = filtered.sort(function(a, b){return a-b});
    achievement.check(list);
    view.renderAchBtn();
  },
  CheckForGameFinish: ()=>{
    //If all has been either selected or cancelled, game is over
    let allSelected = (value) => value>2;
    return controller.ach.every(allSelected);
  },
  roll: ()=>{
    if(controller.count < controller.numOfRolls){
      controller.count++;
      for(i=0;i<controller.unSaved.length;i++){
        if(controller.unSaved[i] !== 0){
          let newDice = controller.newDice();
          controller.unSaved[i] = newDice;
          view.renderDice(i, newDice);
        }
      }
    } 
  view.renderBtn();
  },
  select: (id)=>{
    var arrIndex = id - 30;
    //Choose between 'select' and 'cancel'
    if (controller.ach[arrIndex]==1){
    //'select'
      controller.changeAchList(arrIndex, 3);
    } else {
    //'cancel'
      controller.changeAchList(arrIndex, 4);
    }
    controller.resetAchList();
    controller.updatePoints(arrIndex);
    controller.endRound();
  },
  changeAchList: (achIndex, val)=>{
    controller.ach.splice(achIndex, 1, val);
  },
  resetAchList: ()=>{
    for(i=0; i<controller.ach.length; i++){
      if (controller.ach[i]<3){
        controller.ach[i]=0;
      }
    }
    view.renderAchBtn();
  },
  updatePoints: (arrIndex)=>{
    let sumOfPoints;
    if (controller.ach[arrIndex]==3){
      sumOfPoints = controller.sumPoints(controller.saved);
    } else {
      sumOfPoints = 0;
    }
    controller.addPoints(arrIndex, sumOfPoints);
    controller.totalPoints();
  },
  sumPoints: (arr)=>{
    var sum = arr. reduce(function(a, b){
    return a + b;
    }, 0);
    return sum;
  },
  addPoints: (arrIndex, sum)=>{
    controller.points[arrIndex]=sum;
    view.renderPoint(arrIndex, sum);
  },
  totalPoints: ()=>{
    var sum = controller.points.reduce(function(a, b){
      return a + b;
      }, 0);
    view.renderTotalPoints(sum);
  }
}
//--------------------------------------------------------------
var view = {
  renderDice: (id, eyes)=>{
    let location = document.getElementById(id);
    location.setAttribute('class', 'dice'+eyes);
  },
  renderBtn: ()=>{
    //update innerHTML or make a class
    if (controller.count==controller.numOfRolls){
    document.getElementById('rollButton').style.display = "none";//display none instead
    controller.checkAchievement();
    } else {
      document.getElementById('rollButton').style.display="initial";
    }
  },
  renderAchBtn: ()=>{ //OLD : 0=not available 1=available 2=selected 3=cancel available 4=cancelled
     /**************************
     *   0 = not available     *
     *   1 = select available  *
     *   2 = cancel available  *
     *   3 = selected          *
     *   4 = cancelled         *
    ***************************/

    for (i=0;i<controller.ach.length;i++){
      var loc = i+30;
      var p = document.getElementById(loc);
      if(controller.ach[i]==1){
        p.setAttribute('class', 'btnSelect');
        p.innerHTML='+';
      }
      else if(controller.ach[i]==2){
        p.setAttribute('class', 'btnCancel');
        p.innerHTML='-';
      } 
      else {
        p.setAttribute('class', 'btnInvis');
      }
    }
  },
  renderPoint: (arrIndex, sum)=>{
    let newId = arrIndex + 50;
    document.getElementById(newId).innerHTML=sum;
  },
  renderTotalPoints: (sum)=>{
    document.getElementById("69").innerHTML=sum;
  },
}
//--------------------------------------------------------------
var achievement = {
  check: function(list){
  
    let join = list.join('');
    checkSame(join);

    function checkSame(join){

      if (controller.ach[0]<3){
        if (join === "1" ||
            join === "11" ||
            join === "111" ||
            join === "1111" ||
            join === "11111" ||
            join === "111111"){
              console.log('aces');
              controller.ach[0]=1;
        } else if(controller.count === controller.numOfRolls){
            controller.ach[0]=2;
        } else {
            controller.ach[0]=0;
        }
      }
      if (controller.ach[1]<3){
        if (join === "2" ||
            join === "22" ||
            join === "222" ||
            join === "2222" ||
            join === "22222" ||
            join === "222222"){
              console.log('twoes');
              controller.ach[1]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[1]=2;
      }  else {
          controller.ach[1]=0;
        }
      }
      if (controller.ach[2]<3){
        if (join === "3" ||
            join === "33" ||
            join === "333" ||
            join === "3333" ||
            join === "33333" ||
            join === "333333"){
              console.log('threes');
              controller.ach[2]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[2]=2;
      }  else {
          controller.ach[2]=0;
        }
      }
      if (controller.ach[3]<3){
        if (join === "4" ||
            join === "44" ||
            join === "444" ||
            join === "4444" ||
            join === "44444" ||
            join === "444444"){
              console.log('fours');
              controller.ach[3]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[3]=2;
      }  else {
          controller.ach[3]=0;
        }
      }
      if (controller.ach[4]<3){
        if (join === "5" ||
            join === "55" ||
            join === "555" ||
            join === "5555" ||
            join === "55555" ||
            join === "555555"){
              console.log('fives');
              controller.ach[4]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[4]=2;
      }  else {
          controller.ach[4]=0;
        }
      }
      if (controller.ach[5]<3){
        if (join === "6" ||
            join === "66" ||
            join === "666" ||
            join === "6666" ||
            join === "66666" ||
            join === "666666"){
              console.log('sixes');
              controller.ach[5]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[5]=2;
      }  else {
          controller.ach[5]=0;
        }
      }
      if (controller.ach[6]<3){
        if (join === "111" ||
            join === "222" ||
            join === "333" ||
            join === "444" ||
            join === "555" ||
            join === "666"){
              console.log('3 of a kind');
              controller.ach[6]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[6]=2;
      }  else {
          controller.ach[6]=0;
        }
      }
      if (controller.ach[7]<3){
        if (join === "1111" ||
            join === "2222" ||
            join === "3333" ||
            join === "4444" ||
            join === "5555" ||
            join === "6666"){
              console.log('4 of a kind');
              controller.ach[7]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[7]=2;
      }  else {
          controller.ach[7]=0;
        }
      }
      if (controller.ach[8]<3){
        if (join === "12345"){
          console.log('Small Straight');
          controller.ach[8]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[8]=2;
      }  else {
          controller.ach[8]=0;
        }
      }
      if (controller.ach[9]<3){
        if (join === "23456"){
          console.log('Large Straight');
          controller.ach[9]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[9]=2;
      }  else {
          controller.ach[9]=0;
        }
      }
      if (controller.ach[10]<3){
        if (join === "123456"){
          console.log('yatzy');
          controller.ach[10]=1;
        } else if(controller.count === controller.numOfRolls){
          controller.ach[10]=2;
      }  else {
          controller.ach[10]=0;
        }
      }
      // make 'chance' ach 
    }
  }
}


controller.init();

