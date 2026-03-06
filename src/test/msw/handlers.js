import {http, HttpResponse} from 'msw'

export const handlers = [
    http.get('/users/get', ({params, request}) => {
        return HttpResponse.json({
            "content": {
                "elements": [
                    {
                        "id": "6b9dd93e-2da3-40c2-a144-2e3a236d63e3",
                        "name": "TU1"
                    },
                    {
                        "id": "571b46b0-8cbc-4829-8eb1-cdff89df5998",
                        "name": "TU2"
                    }
                ],
                "totalPageCount": 1,
                "totalElementsCount": 2
            }, "errors": []
        })
    })
]