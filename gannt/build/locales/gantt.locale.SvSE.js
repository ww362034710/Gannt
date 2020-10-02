/*!
 *
 * Bryntum Gantt 2.1.7
 *
 * Copyright(c) 2020 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("SvSE",[],t):"object"==typeof exports?exports.SvSE=t():(e.bryntum=e.bryntum||{},e.bryntum.locales=e.bryntum.locales||{},e.bryntum.locales.SvSE=t())}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}n.d(t,"a",(function(){return s}));var s=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"mergeLocales",value:function(){for(var e={},t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return n.forEach((function(t){Object.keys(t).forEach((function(n){"object"===i(t[n])?e[n]=a(a({},e[n]),t[n]):e[n]=t[n]}))})),e}},{key:"trimLocale",value:function(e,t){var n=function(t,n){if(!e[t])throw new Error('Key "'.concat(t,"\" doesn't exist in locale"));if(n){if(!e[t][n])throw new Error('SubKey "'.concat(t,".").concat(n,"\" doesn't exist in locale"));delete e[t][n]}else delete e[t]};Object.keys(t).forEach((function(e){Array.isArray(t[e])?t[e].forEach((function(t){return n(e,t)})):n(e)}))}},{key:"publishLocale",value:function(e,t){var n=window.bryntum=window.bryntum||{},r=n.locales=n.locales||{};r[e]=r[e]?this.mergeLocales(r[e],t):t}}],(n=null)&&l(t.prototype,n),r&&l(t,r),e}()},,function(e,t,n){"use strict";n.r(t);var r={localeName:"SvSE",localeDesc:"Svenska",Object:{Yes:"Ja",No:"Nej",Cancel:"Avbryt"},Combo:{noResults:"Inga resultat"},FilePicker:{file:"Fil"},Field:{badInput:"Ogiltigt värde",patternMismatch:"Värdet ska matcha ett specifikt mönster",rangeOverflow:function(e){return"Värdet måste vara mindre än eller lika med ".concat(e.max)},rangeUnderflow:function(e){return"Värdet måste vara större än eller lika med ".concat(e.min)},stepMismatch:"Värdet bör passa steget",tooLong:"Värdet för långt",tooShort:"Värdet för kort",typeMismatch:"Värdet är inte i förväntat format",valueMissing:"Detta fält är obligatoriskt",invalidValue:"Ogiltigt värde",minimumValueViolation:"För lågt värde",maximumValueViolation:"För högt värde",fieldRequired:"Detta fält är obligatoriskt",validateFilter:"Värdet måste väljas från listan"},DateField:{invalidDate:"Ogiltigt datum"},TimeField:{invalidTime:"Ogiltig tid"},List:{loading:"Laddar..."},PagingToolbar:{firstPage:"Gå till första sidan",prevPage:"Gå till föregående sida",page:"Sida",nextPage:"Gå till nästa sida",lastPage:"Gå till sista sidan",reload:"Ladda om den aktuella sidan",noRecords:"Inga rader att visa",pageCountTemplate:function(e){return"av ".concat(e.lastPage)},summaryTemplate:function(e){return"Visar poster ".concat(e.start," - ").concat(e.end," av ").concat(e.allCount)}},DateHelper:{locale:"sv-SE",weekStartDay:1,unitNames:[{single:"millisekund",plural:"millisekunder",abbrev:"ms"},{single:"sekund",plural:"sekunder",abbrev:"s"},{single:"minut",plural:"minuter",abbrev:"min"},{single:"timme",plural:"timmar",abbrev:"tim"},{single:"dag",plural:"dagar",abbrev:"d"},{single:"vecka",plural:"vecka",abbrev:"v"},{single:"månad",plural:"månader",abbrev:"mån"},{single:"kvartal",plural:"kvartal",abbrev:"kv"},{single:"år",plural:"år",abbrev:"år"}],unitAbbreviations:[["ms","mil"],["s","sek"],["m","min"],["t","tim","h"],["d"],["v","ve"],["må","mån"],["kv","kva"],[]],ordinalSuffix:function(e){var t=e[e.length-1];return e+("11"===e||"12"===e||"1"!==t&&"2"!==t?"e":"a")},parsers:{L:"YYYY-MM-DD",LT:"HH:mm"}}},a=n(0),o=a.a.mergeLocales(r,{ColumnPicker:{column:"Kolumn",columnsMenu:"Kolumner",hideColumn:"Dölj kolumn",hideColumnShort:"Dölj"},Filter:{applyFilter:"Använd filter",editFilter:"Redigera filter",filter:"Filter",on:"På",before:"Före",after:"Efter",equals:"Lika med",lessThan:"Mindre än",moreThan:"Större än",removeFilter:"Ta bort filter"},FilterBar:{enableFilterBar:"Visa filterrad",disableFilterBar:"Dölj filterrad"},Group:{group:"Gruppera",groupAscending:"Gruppera stigande",groupDescending:"Gruppera fallande",groupAscendingShort:"Stigande",groupDescendingShort:"Fallande",stopGrouping:"Sluta gruppera",stopGroupingShort:"Sluta"},Search:{searchForValue:"Sök efter värde"},Sort:{sort:"Sortera",sortAscending:"Sortera stigande",sortDescending:"Sortera fallande",multiSort:"Multisortering",addSortAscending:"Lägg till stigande",addSortDescending:"Lägg till fallande",toggleSortAscending:"Ändra till stigande",toggleSortDescending:"Ändra till fallande",removeSorter:"Ta bort sorterare",sortAscendingShort:"Stigande",sortDescendingShort:"Fallande",removeSorterShort:"Ta bort",addSortAscendingShort:"+ Stigande",addSortDescendingShort:"+ Fallande"},GridBase:{loadFailedMessage:"Ett fel har uppstått, vänligen försök igen!",syncFailedMessage:"Datasynkronisering misslyckades!",unspecifiedFailure:"Ospecificerat fel",unknownFailure:"Okänt fel",networkFailure:"Nätverksfel",parseFailure:"Det gick inte att bearbeta serversvaret",loadMask:"Laddar...",syncMask:"Sparar ändringar, vänligen vänta...",noRows:"Inga rader att visa",removeRow:"Ta bort rad",removeRows:"Ta bort rader",moveColumnLeft:"Flytta till vänstra sektionen",moveColumnRight:"Flytta till högra sektionen",moveColumnTo:function(e){return"Flytta kolumn till ".concat(e)}},PdfExport:{"Waiting for response from server":"Väntar på svar från servern...","Export failed":"Export misslyckades","Server error":"Serverfel","Generating pages":"Genererar sidor..."},ExportDialog:{width:"40em",labelWidth:"13em",exportSettings:"Exportera inställningar",export:"Exportera",exporterType:"Styra sidbrytningarna",cancel:"Avbryt",fileFormat:"Filformat",rows:"Кader",alignRows:"Anpassa raderna",columns:"Kolumner",paperFormat:"Pappersformat",orientation:"Orientering",repeatHeader:"Upprepa rubriken"},ExportRowsCombo:{all:"Alla rader",visible:"Synliga rader"},ExportOrientationCombo:{portrait:"Stående",landscape:"Liggande"},SinglePageExporter:{singlepage:"En sida"},MultiPageExporter:{multipage:"Flera sidor",exportingPage:function(e){var t=e.currentPage,n=e.totalPages;return"Exporterar sidan ".concat(t,"/").concat(n)}},MultiPageVerticalExporter:{multipagevertical:"Flera sidor (lodrätt)",exportingPage:function(e){var t=e.currentPage,n=e.totalPages;return"Exporterar sidan ".concat(t,"/").concat(n)}}}),i=a.a.mergeLocales(o,{ResourceInfoColumn:{eventCountText:function(e){return e+" händelse"+(1!==e?"r":"")}},Dependencies:{from:"Från",to:"Till",valid:"Giltig",invalid:"Ogiltig",Checking:"Kontrollerar…"},EventEdit:{Name:"Namn",Resource:"Resurs",Start:"Start",End:"Slut",Save:"Spara",Delete:"Ta bort",Cancel:"Avbryt","Edit Event":"Redigera bokning",Repeat:"Upprepa"},DependencyEdit:{From:"Från",To:"Till",Type:"Typ",Lag:"Fördröjning","Edit dependency":"Ändra beroende",Save:"Spara",Delete:"Ta bort",Cancel:"Avbryt",StartToStart:"Start till Start",StartToEnd:"Start till Slut",EndToStart:"Slut till Start",EndToEnd:"Slut till Slut"},EventDrag:{eventOverlapsExisting:"Överlappar befintlig händelse för den här resursen",noDropOutsideTimeline:"Händelsen kan inte släppas utanför tidsaxeln"},Scheduler:{"Add event":"Lägg till bokning","Delete event":"Ta bort bokning","Unassign event":"Ta bort resurskoppling"},HeaderContextMenu:{pickZoomLevel:"Välj zoomnivå",activeDateRange:"Aktivt datumintervall",startText:"Start datum",endText:"Slut datum",todayText:"I dag"},EventFilter:{filterEvents:"Filtrera händelser",byName:"Med namn"},TimeRanges:{showCurrentTimeLine:"Visa aktuell tidslinje"},PresetManager:{minuteAndHour:{topDateFormat:"ddd, DD/MM, h:mm"},hourAndDay:{topDateFormat:"ddd DD/MM"},weekAndDay:{displayDateFormat:"HH:mm"}},RecurrenceConfirmationPopup:{"delete-title":"Borttagning av bokning","delete-all-message":"Vill du ta bort alla instanser av denna bokning?","delete-further-message":"Vill du ta bort denna och alla framtida instanser av denna bokning, eller bara denna?","delete-further-btn-text":"Ta bort alla framtida","delete-only-this-btn-text":"Ta bort endast denna","update-title":"Redigering av upprepad bokning","update-all-message":"Vill du ändra alla instanser av denna bokning?","update-further-message":"Vill du ändra på endast denna instans, eller denna och alla framtida?","update-further-btn-text":"Alla framtida","update-only-this-btn-text":"Endast denna",Yes:"Ja",Cancel:"Avbryt",width:500},RecurrenceLegend:{" and ":" och ",Daily:"Daglig","Weekly on {1}":function(e){var t=e.days;return"Veckovis på ".concat(t)},"Monthly on {1}":function(e){var t=e.days;return"Måntaligen den ".concat(t)},"Yearly on {1} of {2}":function(e){var t=e.days,n=e.months;return"Årligen ".concat(t," ").concat(n)},"Every {0} days":function(e){var t=e.interval;return"Var ".concat(t," dag")},"Every {0} weeks on {1}":function(e){var t=e.interval,n=e.days;return"Var ".concat(t," vecka på ").concat(n)},"Every {0} months on {1}":function(e){var t=e.interval,n=e.days;return"Var ".concat(t," månad ").concat(n)},"Every {0} years on {1} of {2}":function(e){var t=e.interval,n=e.days,r=e.months;return"Var ".concat(t," år på ").concat(n," av ").concat(r)},position1:"den första",position2:"den andra",position3:"den tredje",position4:"den fjärde",position5:"den femte","position-1":"den sista",day:"dagen",weekday:"veckodagen","weekend day":"dagen i veckoslut",daysFormat:function(e){var t=e.position,n=e.days;return"".concat(t," ").concat(n)}},RecurrenceEditor:{"Repeat event":"Upprepa bokning",Cancel:"Avbryt",Save:"Spara",Frequency:"Frekvens",Every:"Var",DAILYintervalUnit:"dag",WEEKLYintervalUnit:"vecka på:",MONTHLYintervalUnit:"månad",YEARLYintervalUnit:"år i:",Each:"Varje","On the":"På den","End repeat":"Avsluta upprepning","time(s)":"upprepningar"},RecurrenceDaysCombo:{day:"dagen",weekday:"veckodagen","weekend day":"dagen i veckoslutet"},RecurrencePositionsCombo:{position1:"första",position2:"andra",position3:"tredje",position4:"fjärde",position5:"femte","position-1":"sista"},RecurrenceStopConditionCombo:{Never:"Aldrig",After:"Efter","On date":"På datum"},RecurrenceFrequencyCombo:{Daily:"Daglig",Weekly:"Veckovis",Monthly:"Månatlig",Yearly:"Årlig"},RecurrenceCombo:{None:"Ingen",Custom:"Anpassad..."},Summary:{"Summary for":function(e){return"Sammanfattning för ".concat(e)}},ScheduleRangeCombo:{completeview:"Hela schemat",currentview:"Aktuell vy",daterange:"Datumintervall",completedata:"Hela schemat (alla aktiviteter)"},SchedulerExportDialog:{"Schedule range":"Tidsintervall","Export from":"Från","Export to":"Till"},ExcelExporter:{"No resource assigned":"Ingen resurs tilldelad"},CrudManagerView:{serverResponseLabel:"Serversvar:"}}),l=a.a.mergeLocales(i,{SchedulerProCommon:{SS:"SS",SF:"SA",FS:"AS",FF:"AA",dependencyTypesLong:["Start-Till-Start","Start-Till-Avslut","Avslut-Till-Start","Avslut-Till-Avslut"]},ConstraintTypePicker:{none:"Ingen",muststarton:"Måste starta",mustfinishon:"Måste avslutas",startnoearlierthan:"Starta tidigast",startnolaterthan:"Starta senast",finishnoearlierthan:"Avsluta tidigast",finishnolaterthan:"Avsluta senast"},CalendarField:{"Default calendar":"Standardkalender"},ProTaskEdit:{"Edit event":"Redigera händelse"},TaskEditorBase:{editorWidth:"45em",Information:"Information",Save:"Spara",Cancel:"Avbryt",Delete:"Ta bort",saveError:"Kan inte spara, vänligen korrigera fel först"},SchedulerGeneralTab:{labelWidth:"11.0em",General:"Allmänt",Name:"Namn","% complete":"% Färdig",Duration:"Varaktighet",Start:"Start",Finish:"Slut",Dates:"Datum","Manually scheduled":"Manuellt planerad",Calendar:"Kalender"},GeneralTab:{labelWidth:"8em",General:"Allmänt",Name:"Namn","% complete":"% Färdig",Duration:"Varaktighet",Start:"Start",Finish:"Slut",Effort:"Arbetsinsats",Dates:"Datum"},AdvancedTab:{labelWidth:"11em",Advanced:"Avancerat",Calendar:"Kalender","Scheduling mode":"Aktivitetstyp","Effort driven":"Insatsdriven","Manually scheduled":"Manuellt planerad","Constraint type":"Villkorstyp","Constraint date":"Måldatum",Constraint:"Villkor",Rollup:"Upplyft"},DependencyTab:{Predecessors:"Föregångare",Successors:"Efterföljare",ID:"ID",Name:"Namn",Type:"Typ",Lag:"Fördröjning","Cyclic dependency has been detected":"Cycliskt beroende","Invalid dependency":"Ogiltigt beroende"},ResourcesTab:{unitsTpl:function(e){var t=e.value;return"".concat(t,"%")},Resources:"Resurser",Resource:"Resurs",Units:"Enheter"},NotesTab:{Notes:"Anteckning"},SchedulingModePicker:{Normal:"Normal","Fixed Duration":"Fast varaktighet","Fixed Units":"Fasta enheter","Fixed Effort":"Fast arbete"},DurationColumn:{Duration:"Varaktighet"}}),s=a.a.mergeLocales(l,{Object:{Save:"Spara"},AddNewColumn:{"New Column":"Lägg till ny kolumn..."},EarlyStartDateColumn:{"Early Start":"Tidig Start"},EarlyEndDateColumn:{"Early End":"Tidigt Slut"},LateStartDateColumn:{"Late Start":"Sen Start"},LateEndDateColumn:{"Late End":"Sent Slut"},TotalSlackColumn:{"Total Slack":"Totalt slack"},MilestoneColumn:{Milestone:"Milstolpe (v)"},EffortColumn:{Effort:"Arbetsinsats"},CalendarColumn:{Calendar:"Kalender"},ConstraintDateColumn:{"Constraint Date":"Måldatum"},ConstraintTypeColumn:{"Constraint Type":"Villkorstyp"},DeadlineDateColumn:{Deadline:"Deadline"},DependencyColumn:{"Invalid dependency found, change is reverted":"Ogiltigt beroende hittades, ändringen ej utförd"},DurationColumn:{Duration:"Varaktighet"},EndDateColumn:{Finish:"Slut"},NameColumn:{Name:"Aktivitet"},NoteColumn:{Note:"Anteckning"},PercentDoneColumn:{"% Done":"% Färdig"},PredecessorColumn:{Predecessors:"Föregående"},ResourceAssignmentColumn:{"Assigned Resources":"Tilldelade Resurser","more resources":"ytterligare resurser"},RollupColumn:{Rollup:"Upplyft"},SchedulingModeColumn:{"Scheduling Mode":"Läge"},SequenceColumn:{Sequence:"#"},StartDateColumn:{Start:"Start"},ShowInTimelineColumn:{"Show in timeline":"Visa i tidslinje"},SuccessorColumn:{Successors:"Efterföljande"},WBSColumn:{WBS:"Strukturkod"},EventModeColumn:{"Event mode":"Händelse läge",Manual:"Manuell",Auto:"Automatiskt"},ManuallyScheduledColumn:{"Manually scheduled":"Manuellt planerad"},ProjectLines:{"Project Start":"Projektstart","Project End":"Projektslut"},TaskTooltip:{Start:"Börjar",End:"Slutar",Duration:"Längd",Complete:"Färdig"},AssignmentGrid:{Name:"Resursnamn",Units:"Enheter",unitsTpl:function(e){var t=e.value;return t?t+"%":""}},AssignmentEditGrid:{Name:"Resursnamn",Units:"Enheter"},Gantt:{Edit:"Redigera uppgift",Indent:"Indrag",Outdent:"Minska indrag","Convert to milestone":"Konvertera till milstolpe",Add:"Lägg till...","New task":"Ny aktivitet","New milestone":"Ny milstolpe","Task above":"Aktivtitet över","Task below":"Aktivitet under","Delete task":"Ta bort aktivitet(er)",Milestone:"Milstolpe","Sub-task":"Underaktivitet",Successor:"Efterföljare",Predecessor:"Föregångare",changeRejected:"Schemaläggningsmotorn avvisade ändringarna"},GanttCommon:{dependencyTypes:["SS","SA","AS","AA"]},Indicators:{earlyDates:"Tidigt start/slut",lateDates:"Sent start/slut",deadlineDate:"Deadline",Start:"Start",End:"Slut"}});a.a.trimLocale(s,{EventEdit:["Repeat"],RecurrenceCombo:{},RecurrenceConfirmationPopup:{},RecurrenceDaysCombo:{},RecurrenceEditor:{},RecurrenceFrequencyCombo:{},RecurrenceLegend:{},RecurrencePositionsCombo:{},RecurrenceStopConditionCombo:{}});t.default=s}]).default}));