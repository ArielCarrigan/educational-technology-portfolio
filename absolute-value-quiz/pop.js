//change 5 to the total number of questions
var total=5
var question=new Array()
for (i=1;i<=total+1;i++){
temp="choice"+i+"=new Array()"
eval(temp)
}
var solution=new Array()
solution[1]="c"
solution[2]="a"
solution[3]="b"
solution[4]="d"
solution[5]="b"


/*Below lists the phrases that will be randomly displayed if the user correctly answers the question. You may extend or shorten this list as desired*/
var compliments=new Array()
compliments[0]="Excellent Work!"
compliments[1]="You've Got It!"
compliments[2]="Great Mathematical Thinking!"
compliments[3]="Way To Go!"
compliments[4]="You're an Absolute Value Expert!"
compliments[5]="Yippee!"
compliments[6]="Yessss!"
compliments[7]="You're on FIRE!"
compliments[8]="FABULOUS!"
compliments[9]="You ROCK!"
compliments[10]="Yabadabadoo!"


/*Below lists the questions, its choices, and finally, the solution to each question. Folow the exact format below when editing the questions. You may have as many questions as needed. Check doc at http://javascriptkit.com/script/script2/comboquiz.htm for more info
*/

question[1]="What is the absolute value of -8?"
choice1[1]="-8"
choice1[2]="0"
choice1[3]="8"
choice1[4]="16"

question[2]="What does the absolute value of a number represent?"
choice2[1]="The distance from zero on a number line"
choice2[2]="The opposite of a number"
choice2[3]="The distance between two positive numbers"
choice2[4]="The number multiplied by itself"

question[3]="Which pair of numbers both have an absolute value of 6?"
choice3[1]="-3 and 3"
choice3[2]="-6 and 6"
choice3[3]="0 and 6"
choice3[4]="-6 and 0"

question[4]="What is the value of |-4| + |-7|?"
choice4[1]="-11"
choice4[2]="3"
choice4[3]="-3"
choice4[4]="11"

question[5]="The temperature outside is -9 degrees Farenheit. How far is this temperature from 0 degrees Farenheit?"
choice5[1]="-9 degrees"
choice5[2]="9 degrees"
choice5[3]="0 degrees"
choice5[4]="18 degrees"

question[6]="What is the capital of Brazil?"
choice6[1]="Brasilia"
choice6[2]="Rio de Janeiro"
choice6[3]="Sao Paulo"
choice6[4]="Fortaleza"

question[7]="What is the world's largest country by area?"
choice7[1]="Argentina"
choice7[2]="Australia"
choice7[3]="Russia"
choice7[4]="Canada"

question[8]="Which pair of numbers both have the absolute value of 6?"
choice8[1]="-3 and 3"
choice8[2]="-6 and 6"
choice8[3]="0 and 6"
choice8[4]="-6 and 0"

question[9]="What is the world's southernmost continent?"
choice9[1]="Asia"
choice9[2]="Australia"
choice9[3]="Antarctica"
choice9[4]="Africa"

question[10]="In what country is Machu Picchu located"
choice10[1]="Chile"
choice10[2]="Peru"
choice10[3]="Argentina"
choice10[4]="Bolivia"

solution[6]="a"
solution[7]="c"
solution[8]="d"
solution[9]="c"
solution[10]="b"
