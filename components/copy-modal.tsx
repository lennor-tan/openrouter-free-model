'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { Model } from '@/types';

interface CopyModalProps {
  selectedModels: Model[];
  children: React.ReactNode;
}

const generateMappedName = (
  modelId: string,
  prefix: string,
  stripFree: boolean,
  stripCompany: boolean,
): string => {
  let mappedName = modelId;
  if (stripCompany) {
    mappedName = mappedName.split('/')[1] || mappedName;
  }
  if (!stripFree) {
    mappedName = `${mappedName}:free`;
  }
  if (prefix) {
    mappedName = `${prefix}${mappedName.replace('/', '@')}`;
  }
  return mappedName;
};

const formatNewAPIJson = (
  models: Model[],
  enableMapping: boolean,
  prefix: string,
  stripFree: boolean,
  stripCompany: boolean,
): string => {
  const mapping = models.reduce(
    (acc, model) => {
      const originalName = `${model.id}:free`;
      const mappedName = enableMapping
        ? generateMappedName(model.id, prefix, stripFree, stripCompany)
        : originalName;
      acc[mappedName] = originalName;
      return acc;
    },
    {} as Record<string, string>,
  );
  return JSON.stringify(mapping, null, 2);
};

const formatUniAPI = (
  models: Model[],
  enableMapping: boolean,
  prefix: string,
  stripFree: boolean,
  stripCompany: boolean,
): string => {
  return models
    .map((model) => {
      const originalName = `${model.id}:free`;
      if (!enableMapping) {
        return `      - ${originalName}`;
      }
      const mappedName = generateMappedName(
        model.id,
        prefix,
        stripFree,
        stripCompany,
      );
      return `      - ${originalName}: ${mappedName}`;
    })
    .join('\n');
};

export function CopyModal({ selectedModels, children }: CopyModalProps) {
  const t = useTranslations('CopyModal');
  const [enableMapping, setEnableMapping] = useState(false);
  const [mappingPrefix, setMappingPrefix] = useState('openrouter@');
  const [mappingStripFree, setMappingStripFree] = useState(false);
  const [mappingStripCompany, setMappingStripCompany] = useState(false);

  const [newApiJsonContent, setNewApiJsonContent] = useState('');
  const [uniApiContent, setUniApiContent] = useState('');
  const [newApiCsvContent, setNewApiCsvContent] = useState('');

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copied', { format }));
  };

  const initialNewApiJson = useMemo(() => {
    return formatNewAPIJson(
      selectedModels,
      enableMapping,
      mappingPrefix,
      mappingStripFree,
      mappingStripCompany,
    );
  }, [
    selectedModels,
    enableMapping,
    mappingPrefix,
    mappingStripFree,
    mappingStripCompany,
  ]);

  const initialUniApi = useMemo(() => {
    return formatUniAPI(
      selectedModels,
      enableMapping,
      mappingPrefix,
      mappingStripFree,
      mappingStripCompany,
    );
  }, [
    selectedModels,
    enableMapping,
    mappingPrefix,
    mappingStripFree,
    mappingStripCompany,
  ]);

  useEffect(() => {
    setNewApiJsonContent(initialNewApiJson);
  }, [initialNewApiJson]);

  useEffect(() => {
    setUniApiContent(initialUniApi);
  }, [initialUniApi]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(newApiJsonContent);
      if (typeof parsed === 'object' && parsed !== null) {
        const keys = Object.keys(parsed);
        setNewApiCsvContent(keys.join(','));
      }
    } catch (error) {
      // If JSON is invalid, keep the last valid state
    }
  }, [newApiJsonContent]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 my-4">
          <Checkbox
            id="enable-mapping"
            checked={enableMapping}
            onCheckedChange={(checked) => setEnableMapping(checked as boolean)}
          />
          <Label htmlFor="enable-mapping">{t('enableMapping')}</Label>
        </div>

        {enableMapping && (
          <div className="p-4 border rounded-md space-y-4 mb-4">
            <h4 className="font-medium">{t('mappingOptions')}</h4>
            <div className="grid grid-cols-2 gap-4 items-center">
              <Label htmlFor="prefix-input">{t('mappingPrefix')}</Label>
              <Input
                id="prefix-input"
                value={mappingPrefix}
                onChange={(e) => setMappingPrefix(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="strip-free"
                checked={mappingStripFree}
                onCheckedChange={(checked) =>
                  setMappingStripFree(checked as boolean)
                }
              />
              <Label htmlFor="strip-free">{t('stripFreeSuffix')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="strip-company"
                checked={mappingStripCompany}
                onCheckedChange={(checked) =>
                  setMappingStripCompany(checked as boolean)
                }
              />
              <Label htmlFor="strip-company">{t('stripCompanyName')}</Label>
            </div>
          </div>
        )}

        <Tabs defaultValue="newapi">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="newapi">NewAPI</TabsTrigger>
            <TabsTrigger value="uniapi">UniAPI</TabsTrigger>
          </TabsList>

          <TabsContent value="newapi" className="space-y-4">
            <CodePreview
              data={newApiCsvContent}
              format={t('modelNameFormat')}
              onCopy={handleCopy}
            />
            <EditablePreview
              value={newApiJsonContent}
              onChange={(e) => setNewApiJsonContent(e.target.value)}
              format={t('modelMappingJsonFormat')}
              onCopy={handleCopy}
            />
          </TabsContent>

          <TabsContent value="uniapi">
            <EditablePreview
              value={uniApiContent}
              onChange={(e) => setUniApiContent(e.target.value)}
              format=""
              onCopy={handleCopy}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function CodePreview({
  data,
  format,
  onCopy,
}: {
  data: string;
  format: string;
  onCopy: (text: string, format: string) => void;
}) {
  const lineCount = data.split('\n').length;
  const height = Math.max(100, Math.min(240, lineCount * 24));

  return (
    <div className="relative mt-4">
      <Label className="text-sm text-muted-foreground">{format}</Label>
      <pre
        className="bg-muted rounded-md p-4 text-sm mt-1 font-mono overflow-y-auto whitespace-pre-wrap break-all"
        style={{ height: `${height}px` }}
      >
        <code>{data}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-8 right-2 h-7 w-7 hover:bg-border"
        onClick={() => onCopy(data, format)}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}

function EditablePreview({
  value,
  onChange,
  format,
  onCopy,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  format: string;
  onCopy: (text: string, format: string) => void;
}) {
  const t = useTranslations('CopyModal');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 240;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  return (
    <div className="relative mt-4">
      {format && (
        <Label className="text-sm text-muted-foreground">{format}</Label>
      )}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        className={`bg-muted rounded-md p-4 text-sm font-mono overflow-y-auto break-all ${format ? 'mt-1' : ''}`}
        placeholder="..."
        rows={1}
      />
      <Button
        variant="ghost"
        size="icon"
        className={`absolute ${format ? 'top-8' : 'top-2'} right-2 h-7 w-7 hover:bg-border`}
        onClick={() => onCopy(value, format || t('uniapiFormat'))}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
