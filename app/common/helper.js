var model = {
    dateFormat: function(date){
        if(typeof date !== 'undefined' && date){
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sept", "Oct", "Nov", "Dec"];
            let parsedDate = Date.parse(date);
            let newDate = new Date(parsedDate);
            let formatDate = ('0' + newDate.getDate()).slice(-2);
            let myDate = months[newDate.getMonth()] +' '+formatDate+', '+newDate.getFullYear();
            return myDate;
        }
    },
    dateConvert: function(date){
        if(typeof date !== 'undefined' && date){
            let parsedDate = Date.parse(date);
            let newDate = new Date(parsedDate);
            let formatDate = ('0' + newDate.getDate()).slice(-2);
            let formatMonth = ('0' + (newDate.getMonth()+1)).slice(-2);
            let convDate = newDate.getFullYear()+'-'+formatMonth+'-'+formatDate;
            return convDate;
        }
    },
    generateYears: function(startYear){
        //let startYear = 2019;
        let endYear = new Date().getFullYear();
        let noYear = endYear - startYear;
        let years =[];
        for(let i = 0; i <= noYear; i++){
            years.push(startYear + i);
        }
        return years;
    },
    convertMonth: function(month){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sept", "Oct", "Nov", "Dec"];
        return ('0' + (months.indexOf(month)+1)).slice(-2);
    },
    listMonths: function(){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sept", "Oct", "Nov", "Dec"];
        return months;
    }
}
export default model;
