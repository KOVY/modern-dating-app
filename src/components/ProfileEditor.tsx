import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  countries: any;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  countries
}) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || 18,
    country: user?.country || 'cz',
    bio: user?.bio || ''
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 18 : value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setPhotos(prev => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setIsLoading(true);
      await updateProfile(formData);
      
      // TODO: Upload photos to server
      if (photos.length > 0) {
        console.log('Photos to upload:', photos.length);
        // Simulate photo upload
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      alert('✅ Profil byl úspěšně aktualizován!');
      onClose();
    } catch (error) {
      alert('❌ Chyba při aktualizaci profilu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDarkMode ? '#2d3748' : 'white',
          borderRadius: '20px',
          width: '95%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: isDarkMode ? 'white' : '#333',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '20px',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
              👤 Editace profilu
            </h2>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              Upravte své údaje a fotografie
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Basic Info */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📝 Základní údaje</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                👤 Jméno
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  background: isDarkMode ? '#1a202c' : 'white',
                  color: isDarkMode ? 'white' : '#333',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  🎂 Věk
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    background: isDarkMode ? '#1a202c' : 'white',
                    color: isDarkMode ? 'white' : '#333',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  🌍 Země
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    background: isDarkMode ? '#1a202c' : 'white',
                    color: isDarkMode ? 'white' : '#333',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {Object.entries(countries).map(([code, data]: [string, any]) => (
                    <option key={code} value={code}>
                      {data.flag} {data.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                📝 O mně
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Napište něco o sobě..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  background: isDarkMode ? '#1a202c' : 'white',
                  color: isDarkMode ? 'white' : '#333',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Photos Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📸 Fotografie</h3>
            
            {/* Photo Upload */}
            <div style={{
              border: `2px dashed ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '15px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDarkMode ? '#4a5568' : '#e2e8f0';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📷</div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                Přidat fotografie
              </p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                Klikněte nebo přetáhněte obrázky sem
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '10px'
              }}>
                {photos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={photo}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading 
                ? (isDarkMode ? '#4a5568' : '#e2e8f0')
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: isLoading ? (isDarkMode ? '#a0aec0' : '#718096') : 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '⏳ Ukládám...' : '💾 Uložit změny'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
