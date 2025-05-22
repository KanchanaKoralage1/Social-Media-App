import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button } from "@mui/material";
import SubscriptionModal from '../subscription/SubscriptionModal';

function RightSide() {

  const [openSubscriptionModal, setOpenSubscriptionModal] = React.useState(false);
  const handleOpenSubscriptionModal = () => setOpenSubscriptionModal(true);
  const handleCloseSubscriptionModal = () => setOpenSubscriptionModal(false);

    const handleChangeTheme=()=>{
        console.log("change theame")
    }

  return (

    <div className='py-5 sticky top '>

        <div className='relative flex items-center'>

            <input type="text" className='py-3 rounded-full text-gray-500 w-full pl-12'/>

            <div className='absolute top-0 left-0 pl-3 pt-3'>
                <SearchIcon className='text-gray-500'/>
            </div>
            <Brightness6Icon className='ml-3 cursor-pointer' onClick={handleChangeTheme}/>
        </div>

        <section className='my-5'>
            <h1 className='text-xl font-bold'>Get Verified</h1>
            <h1 className='font-bold my-2'>Subscribe to unlock new feature</h1>
            <Button
                    sx={{
                      
                      borderRadius: "20px",
                      paddingY: "8px",
                      paddingX: "20px",
                      backgroundColor: "#000000",
                      color: "white",
                      type: "submit",
                    }}
                    onClick={handleOpenSubscriptionModal}
                  >
                    Get Verified
                  </Button>
        </section>

        <section className='mt-7 space-y-5'>
            <h1 className='font-bold text-xl py-1'>Latest news</h1>
            <div>
                <p className='text-sm'>Lorem Ipsum </p>
                <p className='font-bold'>Lorem Ipsum is simply</p>
            </div>

            {[1,1,1,1].map((item)=><div className='flex justify-between w-full'>
                <div>
                    <p>Entertaintment . Trending</p>
                    <p className='font-bold'>The movies</p>
                    <p className='font-bold'>34.3k Tweets</p>
                </div>
                <MoreHorizIcon/>
            </div>)}
            
        </section>
        <section>
          <SubscriptionModal open={openSubscriptionModal} handleClose={handleCloseSubscriptionModal}/>
        </section>
      
    </div>
  )
}

export default RightSide
