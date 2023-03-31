import { useRef, useState } from 'react';
import example from '../icons/Ellipse 15.png';

const _events = [
    {
        title:'AI event',
        url:'https://blog.hyperiondev.com/wp-content/uploads/2019/02/Blog-Tech-Events.jpg'
    },
    {
        title:'Formation',
        url:example
    },
    {
        title:'VR & HR',
        url:'https://socio.events/wp-content/uploads/2022/03/AdobeStock_213888630.jpeg'
    },
    {
        title:'VR & HR',
        url:'https://www.travelperk.com/wp-content/uploads/alexandre-pellaes-6vAjp0pscX0-unsplash-1-1-720x480.jpg'
    },
    {
        title:'design workshop',
        url:example
    },
    {
        title:'AI event',
        url:'https://blog.hyperiondev.com/wp-content/uploads/2019/02/Blog-Tech-Events.jpg'
    },
    {
        title:'Formation graphic design',
        url:example
    },
    {
        title:'VR & HR',
        url:'https://socio.events/wp-content/uploads/2022/03/AdobeStock_213888630.jpeg'
    },
    {
        title:'VR & HR',
        url:'https://www.travelperk.com/wp-content/uploads/alexandre-pellaes-6vAjp0pscX0-unsplash-1-1-720x480.jpg'
    },
    {
        title:'design workshop',
        url:example
    },
    {
        title:'design workshop',
        url:example
    }
]

export default function TimeLine() {

    const [events,setEvents] = useState(_events);
    const timelineRef = useRef();
    const [active,setActive] = useState(0);
    const [right,setRight] = useState(4);

    const callback = (i) => {
        return () => {
            if(i === right) {
                const l = Math.min(right + 4,events.length - 1);
                timelineRef.current.style.left = `-${(l-4)*20}%`;
                setRight(l);
            }
            if(i === right - 4) {
                const l = Math.max(right - 4,4);
                timelineRef.current.style.left = `-${(l-4)*20}%`;
                setRight(l);
            }
            setActive(i);
            console.log(right)
        }
    }

    /*useEffect(() => {
        timelineRef.current.style.left = `-${(right-4)*20}%`;
    },[right])*/

    return (
        <div className='flex items-center w-11/12'>
            <div className='overflow-x-hidden relative w-8/12'>
                <div ref={timelineRef} className='left-0 whitespace-nowrap w-full transition-left relative' >
                    {events.map(({ title }, i) => (
                        <span className='inline-block w-[20%] relative' >
                            <span className='m-auto' >
                                <p className='m-auto text-center w-[14ch] whitespace-normal'>
                                    {i}
                                </p>
                            </span>
                            {(i!==active)?<button className='w-6/12 aspect-square 
                                rounded-full bg-[#62E3E3] m-auto block'
                                onClick={callback(i)}
                            />:<button className='w-6/12 aspect-square 
                            rounded-full bg-[#2693BC] m-auto block'
                            onClick={callback(i)}
                        />}
                        </span>
                    ))}
                </div>
                <hr className='h-1 w-full bg-[#CCF2F2] absolute bottom-2/4 z-[-1]' />
            </div>
            <div className='w-4/12 rounded-full aspect-square' >
                <img 
                    className='w-full rounded-full aspect-square border-8 border-[#62E3E3]'
                    src={events.at(active).url} 
                    alt=''
                />
            </div>
        </div>
    );
}