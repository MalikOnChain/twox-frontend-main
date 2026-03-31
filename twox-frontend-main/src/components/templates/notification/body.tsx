// import { AlertTriangle, X } from 'lucide-react'
// import Image from 'next/image'

// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'

// import CheckTwoLine from '@/assets/check.svg'

// import { NotificationItem } from '@/types/notification'

// interface ContentProps {
//   note: NotificationItem
//   index: number
// }

// const NotificationBody = ({ note, index }: ContentProps) => {
//   if (note.type === 'highlight') {
//     return (
//       <Card
//         key={index}
//         className='border border-yellow-500 bg-background-teritary'
//       >
//         <CardContent className='flex items-center gap-1 p-2'>
//           {note.image && (
//             <Image
//               src={note.image}
//               width={95}
//               height={95}
//               alt='Lucky Win'
//               className='rounded'
//             />
//           )}
//           <div>
//             <h4 className='text-lg font-bold text-yellow-400'>
//               {note.headline}
//             </h4>
//             <div className='text-xs text-secondary-foreground'>
//               {note.description}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   } else if (note.type === 'alert') {
//     return (
//       <div className='p-2'>
//         <p className='mb-2 text-xs text-gray-400'>{note.time}</p>
//         <Card key={index} className='border border-orange-500'>
//           <CardContent className='flex items-start gap-4 p-4'>
//             <AlertTriangle className='text-secondary' fill='#F79009' />
//             <div>
//               <div className='flex items-start justify-between'>
//                 <h4 className='text-lg font-bold text-orange-500'>
//                   {note.headline}
//                 </h4>
//                 <X className='rounded-sm opacity-70 ring-offset-background transition-opacity hover:cursor-pointer hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary' />
//               </div>
//               <div className='text-xs text-secondary-foreground'>
//                 {note.description}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   } else {
//     return (
//       <Card key={index} className='border-none text-white shadow-none'>
//         <CardContent className='p-0'>
//           {note.image && (
//             <Image
//               src={note.image}
//               alt='Banner'
//               width={600}
//               height={200}
//               className='w-full rounded-t-xl'
//             />
//           )}
//           <div className='p-4'>
//             <p className='text-xs text-gray-400'>{note.time}</p>
//             <h4 className='mb-1 text-lg font-bold'>{note.headline}</h4>
//             <div className='text-xs text-secondary-foreground'>
//               {note.description}
//             </div>
//             <div className='mt-4 flex items-center justify-between'>
//               <Button className='rounded bg-indigo-600 px-3 py-[6px] text-white'>
//                 See More
//               </Button>
//               <Button
//                 variant='secondary'
//                 className='border-none bg-background-secondary'
//               >
//                 Mark as read <CheckTwoLine className='ml-1 h-4 w-4' />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }
// }

// export default NotificationBody
