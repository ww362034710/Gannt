Ext.define('MyApp.data.CrudManager', {
    extend: 'Gnt.data.CrudManager',
    onLoad:function(data,other){
    	var d = this.decode(data);
    	if(d.obj){
    		if(d.obj.calendars.rows){
    			Ext.each(d.obj.calendars.rows, function(o){
    				o.Id =o.id;
    				o.Name =o.name;
    				o.DaysPerMonth =o.daysPerMonth;
    				o.DaysPerWeek =o.daysPerWeek;
    				o.HoursPerDay =o.hoursPerDay;
    				o.WeekendsAreWorkdays =o.weekendsAreWorkdays;
    				o.WeekendFirstDay =o.weekendFirstDay;
    				o.WeekendFirstDay =o.weekendFirstDay;
    				o.WeekendSecondDay =o.weekendSecondDay;
    				o.WeekendsAreWorkDays =o.weekendsAreWorkDays;
    				o.DefaultAvailability =o.defaultAvailability|| [];
    				o.defaultAvailableAllocation =o.defaultAvailableAllocation|| [];
    				if(o.days && o.days.rows){
    					Ext.each(o.days.rows,function(a){
    						a.Id =a.id;
    						a.Date = a.date.substr(0,10);
    						a.Availability = a.availability;
    					});
    				}
    				o.Days = o.days;
    			});
    			Ext.each(d.obj.resources.rows, function(o){
    				o.Id =o.id;
    				o.Name =o.name;
    				o.Type =o.type;
    				o.CalendarId =o.calendarId;
    			});
    			Ext.each(d.obj.assignments.rows, function(o){
					o.Id = o.id;
					o.TaskId = o.taskId;
					o.Units = o.units;
    				o.ResourceId =o.resourceId;
    			});
				Ext.each(d.obj.tasks.rows, function(o){
					o.EndDate = o.endDate;
					o.Name = o.name;
					o.StartDate = o.startDate;
					o.TaskType =o.taskType;
					if (o.children) {
						Ext.each(o.children, function(o){
							// o.Id = o.id;
							o.EndDate = o.endDate;
							o.Name = o.name;
							o.StartDate = o.startDate;
							o.TaskType =o.taskType;
							o.Draggable =true;
							o.Resizable =true;
							o.ReadOnly =false;
						});
					}
				});
    		}
    		window.data = d.obj;
    		// return this.callParent([Ext.apply({"success":d.success},d.obj),other]);
			d.obj.success = true;
    		return this.callParent([d.obj,other]);
    	}else{
    		return this.callParent(arguments);
    	}
    },
    onSync:function(data,other){
    	var d = this.decode(data);
    	if(d.obj){
    		return this.callParent([Ext.apply({"success":d.success},d.obj),other]);
    	}else{
    		return this.callParent(arguments);
    	}
    }

})