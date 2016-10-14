// Tasks list block
const TabBar = function(parent, tab1Container, tab2Container) {


  // sets initial state of component
  var state = {
    show: "idle"
  }

  // creates tab button underline rectangle
  const underline = new SMF.UI.Rectangle({
    top: "11%",
    left: "5%",
    width: "33%",
    height: "2",
    roundedEdge: 0,
    fillColor: SMF.UI.Color.RED,
    borderWidth: 0
  });

  if (Device.deviceOS == "Android") {
    underline.height = 4;
  }

  // creates onTabChange handler
  const tabChangeHandler = tabChanger(underline);

  // updates component when state is changed
  const update = function() {
    //tasksList.setTasks(getTasks(), state.show);
    // alert('update');
  }

  // changes component state
  const changeState = function(stateUpdate) {
    return function() {
      //doruk tabbar Change Container Animation Begin
      if (stateUpdate.show == 'idle') {
        tab2Container.animate({
            property: 'left',
            endValue: "100%",
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
        });
        
        tab1Container.animate({
            property: 'left',
            endValue: "0%",
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
        });
      }
      else {
        tab2Container.animate({
            property: 'left',
            endValue: "0%",
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
        });
        
        tab1Container.animate({
            property: 'left',
            endValue: "-100%",
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
        });
      }

      //doruk tabbar Change Container Animation End

      state = Object.assign(state, stateUpdate);
      update();
    }
  }

  const getTasks = function() {
    return "profile"
  };

  const tabButton1 = new SMF.UI.Label({
    top: "3%",
    left: "5%",
    width: "33%",
    height: "8%",
    borderWidth: 0,
    borderColor: SMF.UI.Color.RED,
    textAlignment: SMF.UI.TextAlignment.CENTER
  });

  tabButton1.text = "PROFILE";
  tabButton1.font.size = Device.deviceOS == "Android" ? "8pt" : "7pt";
  // tabButton1.font.bold = true;
  // todoButton.font.family = "Roboto";
  tabButton1.fontColor = "#000000";
  // todoButton.width       = "30%";
  tabButton1.onTouch = tabChangeHandler(
    "5%", "33%", changeState({
      show: "idle"
    }), tabButton1
  );

  const tabButton2 = new SMF.UI.Label({
    top: "3%",
    left: "38%",
    width: "33%",
    height: "8%",
    borderWidth: 0,
    borderColor: SMF.UI.Color.BLUE,
    textAlignment: SMF.UI.TextAlignment.CENTER
  });
  tabButton2.text = "ACTIVITY LOG";
  tabButton2.font.size = Device.deviceOS == "Android" ? "8pt" : "7pt";
  // completedButton.font.bold   = true;
  // completedButton.font.family = "Roboto";
  tabButton2.fontColor = "#000000";
  // todoButton.width       = "30%";
  // completedButton.height      = "10%";
  // completedButton.top         = "23%";
  // completedButton.left        = "40%";
  tabButton2.alpha = 0.6;
  tabButton2.onTouch = tabChangeHandler(
    "38%", "33%", changeState({
      show: "completed"
    })
  );

  // tabButtons.add(todoButton);



  //   // listens todostore onChange stream
  //   // so that side-effects move out from component
  //   TodoStore
  //     .changeHandler$()
  //     .subscribe(function(){
  //       // and update component when data is changed on todo-store.
  //       update();
  //     });

  // add children components
  parent.add(tabButton1);
  parent.add(tabButton2);
  parent.add(underline);
};

const tabChanger = function(underline) {
  var current;

  return function(underlinePos, underlineWidth, changeState, btn) {
    if (btn) {
      current = btn;
    }

    return function(e) {
      changeState();
      if (this !== current) {
        underline.animate({
          property: 'left',
          endValue: underlinePos,
          motionEase: SMF.UI.MotionEase.PLAIN,
          duration: 300,
          onFinish: function() {
            //do your action after finishing the animation
          }
        });

        underline.animate({
          property: 'width',
          endValue: underlineWidth,
          motionEase: SMF.UI.MotionEase.PLAIN,
          duration: 300,
          onFinish: function() {
            //do your action after finishing the animation
          }
        });

        if (current) {
          current.animate({
            property: 'alpha',
            endValue: 0.6,
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
              //do your action after finishing the animation
            }
          });
        }
        this.animate({
          property: 'alpha',
          endValue: 1,
          motionEase: SMF.UI.MotionEase.PLAIN,
          duration: 300,
          onFinish: function() {
            //do your action after finishing the animation
          }
        });

        current = this;
      };
    };
  };
};


// module.exports = TabBar;