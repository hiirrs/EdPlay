'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from '~/components/ui/command';
import { Card } from '~/components/ui/card';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import type { NextPageWithLayout } from '../_app';
import Navbar from '~/components/Navbar';

const RegistrationPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(1);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    schoolId: '',
    schoolLevel: '',
    grade: 0, // saved as number; 0 means "not selected"
    schoolName: '',
  });

  // Query to fetch schools based on education level and search query.
  const { data: schoolOptions, isLoading: loadingSchools } =
    trpc.school.getSchools.useQuery(
      {
        ed_level: formData.schoolLevel,
        search: schoolQuery,
      },
      { enabled: !!formData.schoolLevel }
    );

  // Compute grade options based on school level.
  const gradeOptions =
    formData.schoolLevel === 'SD'
      ? [1, 2, 3, 4, 5, 6]
      : formData.schoolLevel === 'SMP' || formData.schoolLevel === 'SMA'
      ? [1, 2, 3]
      : [];

  // Real-time validation for username and matching passwords.
  useEffect(() => {
    if (/\s/.test(formData.username)) {
      setErrorMessage('Username tidak boleh mengandung spasi.');
    } else if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrorMessage('Password dan konfirmasi password tidak sama.');
    } else {
      setErrorMessage('');
    }
  }, [formData.username, formData.password, formData.confirmPassword]);

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check that all required fields are filled.
    if (
      !formData.username.trim() ||
      !formData.fullname.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setErrorMessage('Mohon isi semua data pada bagian ini terlebih dahulu.');
      return;
    }
    // If any validation error exists, do not proceed.
    if (errorMessage) return;
    setStep(2);
  };

  const [registeredData, setRegisteredData] = useState<{
    token: string;
    user: {
      user_id: number;
      username: string;
      fullname: string;
      schoolId: number;
    };
  } | null>(null);

  const registerMutation = trpc.user.register.useMutation({
    onSuccess(data) {
      toast.success('Registration successful!');
      setRegisteredData(data);
    },
    onError(error: any) {
      toast.error('Registration error: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({
        username: formData.username,
        fullname: formData.fullname,
        password: formData.password,
        schoolId: Number(formData.schoolId),
        grade: formData.grade,
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <Navbar />

      <main className="container mx-auto max-w-2xl pt-4 px-4">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl font-bold mt-2">Selamat Datang di EdPlay</h1>
          <h2 className="text-xl font-semibold">Yuk isi data kamu dulu!</h2>
        </div>

        <Card className="p-6">
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nama Lengkap</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 mt-6" /> : <Eye className="h-5 w-5 mt-6" />}
                  </button>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 mt-6" /> : <Eye className="h-5 w-5 mt-6" />}
                  </button>
                </div>
              </div>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              <Button type="submit" variant="outline" className="w-full">
                Selanjutnya
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="-ml-4 justify-between text-orange-400"
                type="button"
              >
                <ArrowLeft className="h-5 w-5" />
                Kembali
              </Button>
              <div className="grid grid-cols-3 gap-4">
                {['SD', 'SMP', 'SMA'].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        schoolLevel: level,
                        schoolId: '',
                        schoolName: '',
                      })
                    }
                    type="button"
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.schoolLevel === level
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=100&width=100`}
                        alt={`${level} illustration`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xl font-semibold text-center">{level}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Select
                    value={formData.grade ? formData.grade.toString() : ''}
                    onValueChange={(value) =>
                      setFormData({ ...formData, grade: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Kelas {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nama Sekolah</Label>
                  {formData.schoolLevel ? (
                    <Command>
                      <CommandInput
                        placeholder="Cari sekolah..."
                        value={schoolQuery}
                        onValueChange={setSchoolQuery}
                      />
                      <CommandList>
                        {loadingSchools ? (
                          <CommandItem disabled>Loading...</CommandItem>
                        ) : schoolOptions && schoolOptions.length > 0 ? (
                          schoolOptions.slice(0, 5).map((school) => (
                            <CommandItem
                              key={school.sch_id}
                              onSelect={() => {
                                setFormData({
                                  ...formData,
                                  schoolId: school.sch_id.toString(),
                                  schoolName: school.sch_name,
                                });
                                setSchoolQuery(school.sch_name);
                              }}
                            >
                              {school.sch_name}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandItem disabled>
                            Tidak ada sekolah yang cocok
                          </CommandItem>
                        )}
                      </CommandList>
                    </Command>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Pilih level sekolah terlebih dahulu
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                {registerMutation.status === 'pending' ? 'Registering...' : 'Register'}
              </Button>
              {registerMutation.error && (
                <p className="text-red-500">{registerMutation.error.message}</p>
              )}
            </form>
          )}
        </Card>

        {registeredData && true}
      </main>
    </div>
  );
};

export default RegistrationPage;
