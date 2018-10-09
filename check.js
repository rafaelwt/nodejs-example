const Report = require('fluentreports').Report;
var displayReport = require('./reportDisplayer');
var pluralize = require('pluralize')
var numberToText = function(number) {
    switch (number) {
        case 0: return "Zero";
        case 1: return "One";
        case 2: return "Two";
        case 3: return "Three";
        case 4: return "Four";
        case 5: return "Five";
        case 32: return "Thirty-two";
        default:
            return number;
    }
};
function printreport() {
var columnCounter = 0;
var data = [
    {item: 'Tecnologia', count: 5, unit: 'loaf', check: true},
    {item: 'Servicio', count: 3, unit: 'dozen', check: false},
    {item: 'Mantenimiento de computadoras', count: 32, unit: 'gram', check: false},
    {item: 'Bienes Raices', count: 2, unit: 'kilo', check: true},
    {item: 'Exportaciones', count: 3, unit: 'kilo', check: true},
    {item: 'Contruccion', count: 1, unit: 'jar', check: false}
];

var headerFunction = function(Report) {
  Report.print("Lista de Rubros", {fontSize: 22, bold: true, underline:true, align: "center"});
  Report.newLine(2);
  var msg = [
    'Our records indicate that you have invoices that have not been paid and are overdue or you have credits that have not been applied.',
    'You are receiving this statement as a reminder of invoices or credits that haven\'t been resolved.',
    'If you have questions or comments concerning your statement please call 555-1212 and speak to someone in our billing department.',
    '',
    'Thank you in advance for your cooperation in this matter.'];

    Report.print(msg, {textColor: 'blue'});
    Report.newLine();
};

var footerFunction = function(Report) {
  Report.line(Report.currentX(), Report.maxY()-18, Report.maxX(), Report.maxY()-18);
  Report.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
  Report.print("Printed: "+(new Date().toLocaleDateString()), {y: Report.maxY()-14, align: "left"});
};


var detailFunction = function(Report, Data) {
    if (Data.count !== 1) {
        Data.item = pluralize(Data.item);
        Data.unit = pluralize(Data.unit);
    }
    
    Report.box(Report.currentX()-1, Report.currentY()-1, 10, 10, {});
    Report.print(numberToText(Data.count) + ' ' + Data.unit + ' of ' + Data.item, {addX: 12});
 

    Report.newLine();

};

var detailFunctionHorizontal = function(Report, Data) {
    if (Data.count !== 1) {
       Data.item = pluralize(Data.item);
       Data.unit = pluralize(Data.unit);
    }

    var x = 0, y = 0;
    if (columnCounter % 3 === 1) {
        x += 200;
        y = (Report.heightOfString() + 1);
    } else if (columnCounter % 3 === 2) {
        x += 400;
        y = (Report.heightOfString() + 1);
    }
  
    if (Data.check){
        Report.box(Report.currentX()+x , Report.currentY()-y, 10, 10, {});
        Report.circle ( Report.currentX()+x+5, Report.currentY()-y+5, 1.5, {fill: 'black'} )
    } else {
        Report.box(Report.currentX()+x , Report.currentY()-y, 10, 10, {});
    }
   
    // Report.print(numberToText(Data.count) + ' ' + Data.unit + ' of ' + Data.item, {addX: x+12, addY: -(y-1)});
    Report.print( Data.item,  {addX: x+12, addY: -(y-1)});
    columnCounter++;
};


    // You don't have to pass in a report name; it will default to "report.pdf"
    var reportName = "demo-check.pdf";
  
  
    var rpt = new Report(reportName)//, {margins: {left:20, top:20, right: 20, bottom:20}})
        //.margins({left:20, top:20, bottom:20, right: 0})
        .autoPrint(false) // Optional
        .pageHeader(headerFunction)    
        .pageFooter( footerFunction )
        .data( data )	// REQUIRED
        .detail( detailFunctionHorizontal ) // Optional
        .fontSize(8); // Optional

    // This does the MAGIC...  :-)
    console.time("Rendered");
    rpt.render(function(err, name) {
        console.timeEnd("Rendered");
        displayReport(err, name);
    });
  
  
      // Debug output is always nice (Optional, to help you see the structure)
    //  rpt.printStructure(true);

}
printreport();