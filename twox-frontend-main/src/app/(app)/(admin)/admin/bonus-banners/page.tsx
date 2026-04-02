'use client'

import { Edit, Eye, EyeOff,Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  BonusBanner,
  createBonusBanner,
  deleteBonusBanner,
  getAllBonusBanners,
  toggleBonusBannerStatus,
  updateBonusBanner,
} from '@/api/bonus-banner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

import bonusBannerSpinFallback from '@/assets/images/spin_img.png'

export default function BonusBannersAdminPage() {
  const [banners, setBanners] = useState<BonusBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BonusBanner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    highlight: '',
    image: '',
    features: ['', '', ''],
    buttonText: 'Join Now',
    order: 1,
    isActive: true,
  })

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await getAllBonusBanners()
      if (response.success) {
        setBanners(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      toast.error('Failed to load bonus banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingBanner) {
        // Update existing banner
        await updateBonusBanner(editingBanner._id, formData)
        toast.success('Bonus banner updated successfully')
      } else {
        // Create new banner
        await createBonusBanner(formData as any)
        toast.success('Bonus banner created successfully')
      }

      setIsDialogOpen(false)
      setEditingBanner(null)
      resetForm()
      fetchBanners()
    } catch (error) {
      console.error('Failed to save banner:', error)
      toast.error('Failed to save bonus banner')
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bonus banner?')) {
      return
    }

    try {
      await deleteBonusBanner(id)
      toast.success('Bonus banner deleted successfully')
      fetchBanners()
    } catch (error) {
      console.error('Failed to delete banner:', error)
      toast.error('Failed to delete bonus banner')
    }
  }

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleBonusBannerStatus(id)
      toast.success('Bonus banner status updated')
      fetchBanners()
    } catch (error) {
      console.error('Failed to toggle status:', error)
      toast.error('Failed to update status')
    }
  }

  // Open dialog for editing
  const handleEdit = (banner: BonusBanner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      highlight: banner.highlight,
      image: banner.image,
      features: banner.features,
      buttonText: banner.buttonText,
      order: banner.order,
      isActive: banner.isActive,
    })
    setIsDialogOpen(true)
  }

  // Open dialog for creating
  const handleCreate = () => {
    setEditingBanner(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      highlight: '',
      image: '',
      features: ['', '', ''],
      buttonText: 'Join Now',
      order: 1,
      isActive: true,
    })
  }

  // Update feature at index
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <Skeleton className='mb-4 h-10 w-64' />
        <Skeleton className='mb-4 h-32 w-full' />
        <Skeleton className='mb-4 h-32 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='font-satoshi text-3xl font-bold text-white'>
          Bonus Banner Management
        </h1>
        <Button onClick={handleCreate} className='gap-2'>
          <Plus className='h-4 w-4' />
          Add Banner
        </Button>
      </div>

      {/* Banners List */}
      <div className='space-y-4'>
        {banners.map((banner) => (
          <div
            key={banner._id}
            className='rounded-lg border border-mirage bg-custom-dual-gradient p-6'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-3'>
                  <h3 className='font-satoshi text-xl font-bold text-white'>
                    {banner.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      banner.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className='rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400'>
                    Order: {banner.order}
                  </span>
                </div>
                <p className='mb-1 font-satoshi text-lg text-gray-300'>
                  {banner.subtitle}
                </p>
                <p className='mb-3 font-satoshi text-2xl font-bold text-arty-red'>
                  {banner.highlight}
                </p>
                <div className='mb-2 flex flex-wrap gap-2'>
                  {banner.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className='rounded-md bg-gray-700/50 px-2 py-1 font-satoshi text-xs text-white'
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <p className='font-satoshi text-sm text-gray-400'>
                  Button: {banner.buttonText}
                </p>
                <p className='font-satoshi text-sm text-gray-400'>
                  Image: {banner.image}
                </p>
              </div>

              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleToggleStatus(banner._id)}
                  className='gap-2'
                >
                  {banner.isActive ? (
                    <>
                      <EyeOff className='h-4 w-4' />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className='h-4 w-4' />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEdit(banner)}
                  className='gap-2'
                >
                  <Edit className='h-4 w-4' />
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(banner._id)}
                  className='gap-2 border-red-500 text-red-500 hover:bg-red-500/10'
                >
                  <Trash2 className='h-4 w-4' />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className='rounded-lg border border-mirage bg-custom-dual-gradient p-12 text-center'>
            <p className='font-satoshi text-gray-400'>
              No bonus banners found. Create one to get started.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Bonus Banner' : 'Create Bonus Banner'}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? 'Update the bonus banner details below.'
                : 'Fill in the details to create a new bonus banner.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-4'>
              <div>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Join Twox & Get'
                  required
                />
              </div>

              <div>
                <Label htmlFor='subtitle'>Subtitle</Label>
                <Input
                  id='subtitle'
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder='100% BONUS'
                  required
                />
              </div>

              <div>
                <Label htmlFor='highlight'>Highlight</Label>
                <Input
                  id='highlight'
                  value={formData.highlight}
                  onChange={(e) =>
                    setFormData({ ...formData, highlight: e.target.value })
                  }
                  placeholder='UP TO 1 BTC!'
                  required
                />
              </div>

              <div>
                <Label htmlFor='image'>Image URL</Label>
                <Input
                  id='image'
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder={bonusBannerSpinFallback.src}
                  required
                />
              </div>

              <div>
                <Label>Features (3 items)</Label>
                {formData.features.map((feature, idx) => (
                  <Input
                    key={idx}
                    value={feature}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder={`Feature ${idx + 1}`}
                    className='mb-2'
                    required
                  />
                ))}
              </div>

              <div>
                <Label htmlFor='buttonText'>Button Text</Label>
                <Input
                  id='buttonText'
                  value={formData.buttonText}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonText: e.target.value })
                  }
                  placeholder='Join Now'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='order'>Display Order</Label>
                  <Input
                    id='order'
                    type='number'
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    min='1'
                    required
                  />
                </div>

                <div className='flex items-center gap-2 pt-6'>
                  <input
                    type='checkbox'
                    id='isActive'
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className='h-4 w-4'
                  />
                  <Label htmlFor='isActive'>Active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                  setEditingBanner(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type='submit'>
                {editingBanner ? 'Update' : 'Create'} Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

