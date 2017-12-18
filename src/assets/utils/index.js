export  default  {
    dealResult(res, success, error){
        try {
            if(res.data.success){
                success()
            }
        } catch(ex){
            error()
        }
    }
}
