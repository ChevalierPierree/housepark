'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Extra } from '@/lib/types';

interface ExtrasClientProps {
  extras: Extra[];
}

export default function ExtrasClient({ extras: initialExtras }: ExtrasClientProps) {
  const router = useRouter();
  const [extras, setExtras] = useState(initialExtras);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState<'fixed' | 'per_person'>('fixed');
  const [priceAmount, setPriceAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPricingType('fixed');
    setPriceAmount('');
    setError('');
    setEditing(null);
    setShowNew(false);
  };

  const startEdit = (extra: Extra) => {
    setEditing(extra.id);
    setName(extra.name);
    setDescription(extra.description);
    setPricingType(extra.pricing_type);
    setPriceAmount(extra.price_amount.toString());
    setShowNew(false);
  };

  const startNew = () => {
    resetForm();
    setShowNew(true);
  };

  const handleSave = async () => {
    if (!name || !priceAmount) {
      setError('Nom et prix sont obligatoires.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const data = {
      name,
      description,
      pricing_type: pricingType,
      price_amount: parseFloat(priceAmount),
    };

    if (editing) {
      const { error: err } = await supabase
        .from('extras')
        .update(data)
        .eq('id', editing);
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setExtras(extras.map((e) => (e.id === editing ? { ...e, ...data } : e)));
    } else {
      const { data: newExtra, error: err } = await supabase
        .from('extras')
        .insert(data)
        .select()
        .single();
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setExtras([...extras, newExtra as Extra]);
    }

    setLoading(false);
    resetForm();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet extra ?')) return;
    const supabase = createClient();
    await supabase.from('extras').delete().eq('id', id);
    setExtras(extras.filter((e) => e.id !== id));
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Extras</h1>
          <p className="text-gray-500 mt-1">{extras.length} extra{extras.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel extra
        </Button>
      </div>

      {/* New / Edit form */}
      {(showNew || editing) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-dark">
              {editing ? 'Modifier l\'extra' : 'Nouvel extra'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-dark">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="extraName"
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chef privé"
            />
            <Input
              id="extraDesc"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Menu 3 plats..."
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de tarif
              </label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value as 'fixed' | 'per_person')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="fixed">Fixe</option>
                <option value="per_person">Par personne</option>
              </select>
            </div>
            <Input
              id="extraPrice"
              label="Prix (€)"
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              placeholder="50"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Description</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tarif</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Prix</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {extras.map((extra) => (
              <tr key={extra.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-dark">{extra.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                  {extra.description || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    extra.pricing_type === 'fixed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {extra.pricing_type === 'fixed' ? 'Fixe' : 'Par personne'}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-dark">
                  {formatPrice(extra.price_amount)}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => startEdit(extra)}
                    className="text-primary hover:underline text-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 inline mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(extra.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {extras.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Aucun extra. Créez-en un !
          </div>
        )}
      </div>
    </div>
  );
}
