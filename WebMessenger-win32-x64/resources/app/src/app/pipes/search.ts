import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform{
    public transform(value, args: string){
        if(!value)
            return
        if(!args)
            return value
        args = args.toLowerCase(); //para comparar lo mismo
        return value.filter(x => {
            return JSON.stringify(x).toLowerCase().includes(args)
        })
    }
}