import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function Writer() {
    const router = useRouter();
    const {writerId} = router.query;
    const [writer, setWriter] = useState(null);

    const getWriter = () => {
        fetch(`/api/writers/${writerId}`)
            .then(resp => resp.json())
            .then(json => setWriter(json))
            .catch(e => {
                console.error(e);
                setWriter(false);
            });
    };

    // Get data from the API
    useEffect(() => {
        if (router.isReady) {
            getWriter();
        }
    }, [router.isReady]);

    return (
        <main>
            {writer ? (
                <div style={{minHeight: '300px'}}>
                    <h5 style={{fontWeight: 'bold', color: '#b3aa8d', textTransform: 'uppercase'}}>DRAFT.DEV Author
                        Profile</h5>
                    <img src={writer.profile_photo} style={{float: 'right', maxWidth: '250px', marginLeft: '1rem'}}/>
                    <h1>{writer.first_name} {writer.last_name}</h1>
                    <p style={{color: '#778780'}}>
                        {writer.location ? (
                            <span title='Location' style={{marginRight:'1rem'}}>🌍 {writer.location}</span>
                        ) : ('')}
                        {writer.post_count > 5 ? (
                            <span title='This writer has written 5 or more articles for Draft.dev'>
                                📚 5+ Articles
                            </span>
                        ) : ('')}
                    </p>
                    <p>{writer.bio}</p>
                    <p style={{marginTop: '2rem'}}>
                        {writer.website ? (
                            <span title={'Website'}><a style={{color: '#778780'}} href={writer.website}
                                                       target="_blank">Website</a> </span>
                        ) : ('')}
                        {writer.twitter_link ? (
                            <span title={'Twitter'}><a style={{color: '#778780'}} href={writer.twitter_link}
                                                       target="_blank">Twitter</a> </span>
                        ) : ('')}
                    </p>
                </div>
            ) : writer === false ? (
                <p>Writer not found.</p>
            ) : (
                <p>Loading writer...</p>
            )}
        </main>
    );
}
