var Math = {
  add: function(num1, num2) {
    return num1 + num2;
  },

  subtract: function(num1, num2) {
    return num1 - num2;
  },

  multiply: function(num1, num2) {
    return num1 * num2;
  },

  divide: function(num1, num2) {
    return num1 / num2;
  }
}

var Calculator = {

  numbers_pressed: [],
  numbers_actions: [],
  savedMemory: [],  
  display: 0,

  clear: function() {
    Calculator.numbers_actions = [];
    Calculator.savedMemory = [];
    Calculator.numbers_pressed = [];      
    Calculator.display = 0;
  },

  action_to_function: function(action, num1, num2) {
    var actions = { '+': Math.add(num1, num2),
                    '-': Math.subtract(num1, num2),
                    '*': Math.multiply(num1, num2),
                    '/': Math.divide(num1, num2),
    };    
    return actions[action];
  },

  special_methods: function(action) {
    var actions = { 'cl': Calculator.clear,
                    '=': Calculator.calculate_current,
                  };
    return actions[action]();
  },

  calculate_current: function(){
    if(Calculator.savedMemory.length > 0){
       var num1 = Calculator.numbers_actions[0];
       var action = Calculator.savedMemory[1]; 
       var num2 = Calculator.savedMemory[2];
       var result=Calculator.action_to_function(action, num1, num2); 
       Calculator.numbers_actions[0]=result; 
       Calculator.display =result;            
    }
      
    else if (Calculator.numbers_actions.length > 2) {     
      var action = Calculator.numbers_actions[1];    
      var num1 = Calculator.numbers_actions[0]; //first number
      var num2 = Calculator.numbers_actions[2]; //second number
      var result = Calculator.action_to_function(action, num1, num2);
    
      Calculator.clear();
      Calculator.savedMemory[1]=action;
      Calculator.savedMemory[2]=num2;
      Calculator.display = result;        
      Calculator.numbers_actions[0]=result;
    }
  },
  clear_numbers_pressed: function() {
    //if theres numbers pressed  
    if (Calculator.numbers_pressed.length > 0) {
        //combine and parse all the numbers
      var full_number = parseInt(Calculator.numbers_pressed.join(''));
        //savedMemory and add that number to the array
      Calculator.numbers_actions.push( full_number );
        //clears the value of the current number
      Calculator.numbers_pressed = [];
    }
  },

  push_action: function(action) {
    Calculator.clear_numbers_pressed();
      
    if (action == 'cl' || action == '=') {
      Calculator.special_methods(action);
    } else {
      //Calculator.calculate_current();
      Calculator.numbers_actions[1]=action;
      if(Calculator.savedMemory.length > 0){
          Calculator.savedMemory[1]=action;               
        }
    }
    return Calculator.display;
  },

  push_number: function(number) {
    //in the case user type in a number with a leading 0, which is invalid
    if(Calculator.numbers_pressed.length === 0 && number == 0){
        return Calculator.display=0;      
    }
    Calculator.numbers_pressed.push(number);
    Calculator.display = Calculator.numbers_pressed.join('');
    return Calculator.display;
  }
}

$( document ).ready(function() {

  $( ".number" ).on( "click", function() {
    var number = $( this ).text().trim();
    $('#display').val(Calculator.push_number(number));
  });

  $( ".action" ).on( "click", function() {
    var action = $( this ).text().trim();
    $('#display').val(Calculator.push_action( action ));
  });

})
