export const handleSiggIn = async(payload, apiURL) => {
    try {
        const response = await fetch(apiURL,{
            method:'POST',
            body:JSON.stringify(payload),
            headers:{
                'Content-Type': 'application/json',
            }
        })
        if(!response){
            console.error(`Error! Status: ${response.status}`)
            return
        }
        const json = await response.json()
        return json
    } catch (error) {
        console.error('Error during sign-in process:', error.message);
        return
    }
}