"use client";

import React, { useRef, useEffect } from "react";
import { Markmap } from "markmap-view";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";
import { loadCSS, loadJS } from "markmap-common";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";

const transformer = new Transformer();
const { scripts, styles } = transformer.getAssets();

// Type guards
const isStylesDefined = (styles: any): styles is string[] => {
  return Array.isArray(styles);
};

const isScriptsDefined = (scripts: any): scripts is string[] => {
  return Array.isArray(scripts);
};

if (isStylesDefined(styles)) {
  loadCSS(styles);
}

if (isScriptsDefined(scripts)) {
  loadJS(scripts, { getMarkmap: () => markmap });
}

function renderToolbar(mm: Markmap, wrapper: HTMLElement | null) {
  if (!wrapper) return;
  while (wrapper.firstChild) wrapper.firstChild.remove();
  if (mm) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    toolbar.setItems([...Toolbar.defaultItems]);
    wrapper.append(toolbar.render());
  }
}

interface MarkmapProps {
  data: string;
}

export default function MarkmapRenderer({ data }: MarkmapProps) {
  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap | null>(null);
  const refToolbar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refMm.current || !refSvg.current) return;
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
    renderToolbar(mm, refToolbar.current);
  }, []);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(data);
    mm.setData(root);
    mm.fit();
  }, [data]);

  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" ref={refSvg} />
      <div className="absolute bottom-1 right-1" ref={refToolbar}></div>
    </div>
  );
}
