class ApiFeatures{
    constructor(query, queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    filter(){

        const queryObj={...this.queryStr};
        const excludeFields=['sort','fields','page','limit'];
        excludeFields.forEach(el=>delete queryObj[el]);

        let queryString=JSON.stringify(queryObj);
        queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        this.query=this.query.find(JSON.parse(queryString));

        return this;
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy=this.queryStr.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);
        }
        else{
            this.query=this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const fields=this.queryStr.fields.split(',').join(' ');
            console.log("Fields:", fields);
            this.query=this.query.select(fields);
            console.log(this.query.getQuery());
        }
        else{
            this.query=this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page=this.queryStr.page*1 || 1;
        const limit=this.queryStr.limit*1 || 10;
        const skip= (page-1)*limit;
        this.query=this.query.skip(skip).limit(limit);
        return this;
    }

}

module.exports=ApiFeatures;