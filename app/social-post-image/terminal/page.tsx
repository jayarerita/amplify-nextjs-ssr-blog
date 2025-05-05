'use client';
import { TerminalLines } from '@/components/ui/terminal-lines';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import download from 'downloadjs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, X, Settings } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const newLineSchema = z.object({
  text: z.string().min(1, { message: "Line text is required" }),
  isInput: z.boolean().default(true),
});

type NewLineFormValues = z.infer<typeof newLineSchema>;

export default function OGPage() {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [startColor, setStartColor] = useState("#6366f1"); // indigo-500
  const [midColor, setMidColor] = useState("#a855f7");    // purple-500
  const [endColor, setEndColor] = useState("#ec4899");    // pink-500
  const [lines, setLines] = useState([
    {type: 'input' as const, text: 'wc -l w.jsonl'},
    {type: 'output' as const, text: '3742774 w.jsonl'},
    {type: 'input' as const, text: 'ls -lh w.jsonl'},
    {type: 'output' as const, text: '-rwxrwxrwx 1 user user 55G Apr 24 10:54 w.jsonl'},
  ]);

  const form = useForm({
    defaultValues: {
      lines: [
        {text: 'wc -l w.jsonl', isInput: true},
        {text: '3742774 w.jsonl', isInput: false},
        {text: 'ls -lh w.jsonl', isInput: true},
        {text: '-rwxrwxrwx 1 user user 55G Apr 24 10:54 w.jsonl', isInput: false},
      ] as NewLineFormValues[],
    },
  });

  // Function to sync form values to lines state
  const syncFormToLines = () => {
    const formValues = form.state.values;
    if (formValues?.lines) {
      const formattedLines = formValues.lines.map((line: NewLineFormValues) => ({
        type: line.isInput ? 'input' as const : 'output' as const,
        text: line.text
      }));
      setLines(formattedLines);
    }
  };
  
  const handleDownloadImage = () => {
    const printableElement = document.getElementById('printable');
    if (!printableElement) return;
    
    toPng(printableElement)
      .then((dataUrl) => (
        download(dataUrl, 'terminal-image.png')
      ))
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  };

  return (
    <div>
      <div className="p-4 mb-4 flex justify-between">
        <Button 
          onClick={handleDownloadImage}
        >
          Download Image
        </Button>
        
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] w-screen md:w-full">
            <DrawerHeader>
              <DrawerTitle>Image Settings</DrawerTitle>
              <DrawerDescription>
                Configure your image and modify terminal lines.
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="p-4 overflow-y-auto">
              <div id="user-input-container" className="mb-4">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width" className="block text-sm font-medium mb-1">
                        Width (px)
                      </Label>
                      <Input
                        type="number"
                        id="width"
                        className="w-full p-2 border rounded-md"
                        defaultValue={1200}
                        onChange={(e) => {
                         setWidth(parseInt(e.target.value));
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="block text-sm font-medium mb-1">
                        Height (px)
                      </Label>
                      <Input
                        type="number"
                        id="height"
                        className="w-full p-2 border rounded-md"
                        defaultValue={630}
                        onChange={(e) => {
                          setHeight(parseInt(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 mb-4">
                  <h3 className="text-lg font-medium mb-4">Background Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startColor" className="block text-sm font-medium mb-1">
                        Start Color
                      </Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: startColor }}
                        />
                        <Input
                          type="color"
                          id="startColor"
                          value={startColor}
                          onChange={(e) => setStartColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="midColor" className="block text-sm font-medium mb-1">
                        Middle Color
                      </Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: midColor }}
                        />
                        <Input
                          type="color"
                          id="midColor"
                          value={midColor}
                          onChange={(e) => setMidColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="endColor" className="block text-sm font-medium mb-1">
                        End Color
                      </Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: endColor }}
                        />
                        <Input
                          type="color"
                          id="endColor"
                          value={endColor}
                          onChange={(e) => setEndColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md h-10" style={{ 
                    background: `linear-gradient(to bottom right, ${startColor}, ${midColor}, ${endColor})` 
                  }}>
                  </div>
                </div>

                <div className="border rounded-md p-4 mb-4">
                  <h3 className="text-lg font-medium mb-4">Terminal Lines</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    syncFormToLines();
                  }} className="space-y-6">
                    <div className="flex w-full gap-4">
                      <form.Field
                        name="lines"
                        mode="array"
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label className="mr-2">Lines</Label>
                            <div className="pr-2">
                              {field.state.value.map((_, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-2 my-2 items-center">
                                  <form.Field
                                    name={`lines[${index}]`}
                                    children={(subField) => (
                                      <Input
                                        type="text"
                                        className="w-full"
                                        value={subField.state.value.text}
                                        autoFocus
                                        onChange={(e) => {
                                          subField.handleChange({ ...subField.state.value, text: e.target.value });
                                        }}
                                        onBlur={() => syncFormToLines()}
                                      />
                                    )}
                                  />
                                  <span className="flex flex-row gap-2 ml-2 md:ml-0">
                                  <div className="flex items-center space-x-2">
                                    <form.Field
                                      name={`lines[${index}]`}
                                      children={(subField) => (
                                        <>
                                          <Label className={`w-12 ${subField.state.value.isInput ? "text-green-500" : "text-yellow-500"}`}>
                                            {subField.state.value.isInput ? "Input" : "Output"}
                                          </Label>
                                          <Switch
                                            checked={subField.state.value.isInput}
                                            onCheckedChange={(checked) => {
                                              subField.handleChange({ ...subField.state.value, isInput: checked });
                                              syncFormToLines();
                                            }}
                                          />
                                        </>
                                      )}
                                    />
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      field.removeValue(index);
                                      syncFormToLines();
                                    }}
                                    type="button"
                                  >
                                    <X className="h-4 w-4 hover:text-destructive" />
                                  </Button>
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.pushValue({text: '', isInput: true});
                                syncFormToLines();
                              }}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add Line
                            </Button>
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div id="printable" 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(to bottom right, ${startColor}, ${midColor}, ${endColor})`
      }}
      className="flex items-center justify-center">
        <TerminalLines
          width={width*.75}
          height={height*.75} 
          lines={lines}
          showFileSystem={true}
        />
      </div>
    </div>
  );
}
