class ApiFeature{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }

        }:{};
        console.log(keyword)
        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        const queryStrCopy = {...this.queryStr}
        
        const filterStr = ["keyword","page","limit"]
        //removing some fields for get valid key for filter like category ,tag
        filterStr.forEach(ele => delete queryStrCopy[ele]);


        //filter for price and rating
        let querystr = JSON.stringify(queryStrCopy) 
        console.log(querystr)
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`)
        this.query = this.query.find(JSON.parse(querystr));
        console.log(querystr)

        return this

    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultPerPage * (currentPage-1)
        this.query = this.query.limit(resultPerPage).skip(skip)

        return this

    }
}

module.exports = ApiFeature