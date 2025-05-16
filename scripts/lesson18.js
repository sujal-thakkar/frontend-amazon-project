/* fetch('https://supersimplebackend.dev')
    .then((response) => {
        return response.text();
    }).then((data) => {
        console.log(data);
    });

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', () => {
    console.log(xhr.response);
});
xhr.open('GET', 'https://supersimplebackend.dev/greeting');
xhr.send();

fetch('https://supersimplebackend.dev/greeting')
    .then((response) => {
        return response.text();
    }).then((data) => {
        console.log(data);
    });

async function greeting() {
    const greet = await fetch('https://supersimplebackend.dev/greeting');
    const responseText = await greet.text();
    console.log(responseText);
}

greeting(); */

/* async function postToGreeting() {
    const response = await fetch('https://supersimplebackend.dev/greeting', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "Sujal Thakkar"
        })
    });

    const data = await response.text();
    console.log(data);
}

postToGreeting(); */

/* async function getReqAmazon() {
    try {
        const response = await fetch('https://amazon.com');
        if(!response.ok) {
            throw new Error('request failed');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log('CORS error. Your request was blocked by the backend.', error.message);
    }
}

getReqAmazon(); */

async function postGreeting() {
    try {
        const response = await fetch('https://supersimplebackend.dev/greeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status >= 400) throw response;
    }
    catch(error) {
        if(error.status === 400) {
            console.log(await error.json());
        }
        else console.log('Network error, Try again later');
    }
}
postGreeting();